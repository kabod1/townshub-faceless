// Townshub YouTube Deep Analyzer — Content Script
// Manifest V3 compatible

(function () {
  "use strict";

  let panel = null;
  let trigger = null;
  let currentUrl = location.href;
  let activeTab = "overview";

  // ── Utilities ──────────────────────────────────────────────────────────────

  function parseCount(text) {
    if (!text) return 0;
    text = text.replace(/,/g, "").toLowerCase().trim();
    if (text.includes("m")) return parseFloat(text) * 1_000_000;
    if (text.includes("k")) return parseFloat(text) * 1_000;
    return parseInt(text) || 0;
  }

  function outlierScore(views, subs) {
    if (!subs || subs === 0) return 50;
    const ratio = views / subs;
    if (ratio >= 5)   return Math.min(99, Math.round(80 + (ratio - 5) * 2));
    if (ratio >= 2)   return Math.round(60 + (ratio - 2) * 6.7);
    if (ratio >= 0.5) return Math.round(40 + (ratio - 0.5) * 13.3);
    return Math.max(10, Math.round(ratio * 80));
  }

  function scoreColor(s) {
    return s >= 75 ? "#34D399" : s >= 50 ? "#00D4FF" : "#FCD34D";
  }
  function scoreClass(s) {
    return s >= 75 ? "th-score-high" : s >= 50 ? "th-score-medium" : "th-score-low";
  }

  // Try selectors until one returns text
  function queryText(...selectors) {
    for (const sel of selectors) {
      try {
        const el = document.querySelector(sel);
        const t = el?.textContent?.trim();
        if (t) return t;
      } catch (_) {}
    }
    return "";
  }

  // Extract YouTube's embedded JSON-LD data
  function getJsonLd() {
    try {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      for (const s of scripts) {
        const data = JSON.parse(s.textContent);
        if (data["@type"] === "VideoObject" || data["@type"] === "BreadcrumbList") return data;
      }
    } catch (_) {}
    return null;
  }

  // Extract ytInitialData from page scripts
  function getYtInitialData() {
    try {
      const scripts = document.querySelectorAll("script:not([src])");
      for (const s of scripts) {
        const txt = s.textContent || "";
        if (!txt.includes("ytInitialData")) continue;
        const match = txt.match(/var\s+ytInitialData\s*=\s*(\{.+?\});\s*(?:var|window|if)/s);
        if (match) return JSON.parse(match[1]);
      }
    } catch (_) {}
    return null;
  }

  // Safely traverse nested object path
  function dig(obj, ...keys) {
    let cur = obj;
    for (const k of keys) {
      if (cur == null || typeof cur !== "object") return undefined;
      cur = Array.isArray(cur) ? cur[k] : cur[k];
    }
    return cur;
  }

  // ── Scrape all channel/video data ─────────────────────────────────────────

  function isVideoPage() {
    return location.pathname === "/watch";
  }

  function scrapeAll() {
    const onVideo = isVideoPage();
    const jsonLd = getJsonLd();
    const ytData = getYtInitialData();
    const data = { context: onVideo ? "video" : "channel", seoIssues: [] };

    // ── Channel name ────────────────────────────────────────────────────────
    if (onVideo) {
      data.name = queryText(
        "ytd-video-owner-renderer #channel-name a",
        "#owner #channel-name a",
        "#upload-info #channel-name a",
        "ytd-video-owner-renderer ytd-channel-name yt-formatted-string",
        "#owner-name a",
        "ytd-channel-name yt-formatted-string"
      ) || document.title.replace(" - YouTube", "").trim() || "Unknown Channel";
    } else {
      data.name = queryText(
        "#channel-name .ytd-channel-name",
        "ytd-channel-name yt-formatted-string",
        "#inner-header-container ytd-channel-name yt-formatted-string"
      ) || document.title.replace(" - YouTube", "").trim() || "Unknown Channel";
    }

    // ── Subscriber count ────────────────────────────────────────────────────
    const subRaw = onVideo
      ? queryText("#owner-sub-count", "yt-formatted-string#owner-sub-count", "ytd-video-owner-renderer yt-formatted-string[id*='sub']")
      : queryText("#subscriber-count", "yt-formatted-string#subscriber-count");
    data.subsText = subRaw || "—";
    data.subs = parseCount(subRaw.replace(/\s*(subscribers?|member)/gi, ""));

    // ── Video count ─────────────────────────────────────────────────────────
    data.videoCount = "—";
    if (!onVideo) {
      const items = [...document.querySelectorAll(".yt-content-metadata-view-model-wiz__metadata-text, #videos-count")];
      for (const el of items) {
        const t = el.textContent?.trim() || "";
        if (/\d/.test(t) && /video/i.test(t)) { data.videoCount = t; break; }
      }
    }

    // ── Tags ────────────────────────────────────────────────────────────────
    data.tags = [];
    // JSON-LD keywords (most reliable for video pages)
    if (jsonLd?.keywords) {
      data.tags = jsonLd.keywords.split(",").map(t => t.trim()).filter(Boolean);
    }
    // Fallback: meta keywords
    if (data.tags.length === 0) {
      const meta = document.querySelector('meta[name="keywords"]');
      if (meta?.content) data.tags = meta.content.split(",").map(t => t.trim()).filter(Boolean);
    }
    // Fallback: try ytInitialData video tags
    if (data.tags.length === 0 && ytData) {
      try {
        const videoData = dig(ytData, "contents", "twoColumnWatchNextResults", "results", "results", "contents");
        if (Array.isArray(videoData)) {
          for (const item of videoData) {
            const tags = dig(item, "videoPrimaryInfoRenderer", "superTitleLink", "runs");
            if (tags) { data.tags = tags.map(r => r.text).filter(Boolean); break; }
          }
        }
      } catch (_) {}
    }

    // ── Description ─────────────────────────────────────────────────────────
    data.description = "";
    // JSON-LD description (most complete)
    if (jsonLd?.description) {
      data.description = jsonLd.description;
    }
    if (!data.description) {
      data.description = queryText(
        "#description-inner yt-attributed-string span",
        "#meta #description",
        "ytd-text-inline-expander #plain-snippet-text"
      ) || document.querySelector('meta[name="description"]')?.content || "";
    }

    // ── Meta tags ───────────────────────────────────────────────────────────
    data.metaTags = {};
    const metaNames = ["description", "keywords", "robots", "googlebot"];
    for (const name of metaNames) {
      const el = document.querySelector(`meta[name="${name}"]`);
      if (el?.content) data.metaTags[name] = el.content;
    }
    // OG tags
    const ogProps = ["og:title", "og:description", "og:image", "og:url", "og:type"];
    data.ogTags = {};
    for (const prop of ogProps) {
      const el = document.querySelector(`meta[property="${prop}"]`);
      if (el?.content) data.ogTags[prop] = el.content;
    }

    // ── Video title + page title ─────────────────────────────────────────────
    data.pageTitle = jsonLd?.name || queryText(
      "ytd-watch-metadata h1 yt-formatted-string",
      "#above-the-fold h1 yt-formatted-string",
      "#title h1 yt-formatted-string",
      "h1.ytd-watch-metadata"
    ) || document.title.replace(" - YouTube", "").trim();

    // ── View count (video page) ──────────────────────────────────────────────
    data.viewsText = queryText(
      "ytd-video-view-count-renderer .view-count",
      "ytd-video-view-count-renderer span.view-count",
      "#count ytd-video-view-count-renderer span"
    );
    data.views = parseCount(data.viewsText.replace(/\s*views?/gi, "").replace(/,/g, "").trim());

    // ── Upload date / duration ───────────────────────────────────────────────
    data.uploadDate = jsonLd?.uploadDate ? new Date(jsonLd.uploadDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
    if (jsonLd?.duration) {
      const m = jsonLd.duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (m) {
        const h = parseInt(m[1] || 0), min = parseInt(m[2] || 0), sec = parseInt(m[3] || 0);
        data.duration = h > 0 ? `${h}:${String(min).padStart(2,"0")}:${String(sec).padStart(2,"0")}` : `${min}:${String(sec).padStart(2,"0")}`;
      }
    }

    // ── Channel about description (channel page) ─────────────────────────────
    if (!onVideo && !data.description) {
      data.description = queryText(
        "#description-container #description",
        "#right-column yt-formatted-string",
        "ytd-channel-about-metadata-renderer #description"
      ) || document.querySelector('meta[property="og:description"]')?.content || "";
    }

    // ── Outlier score ────────────────────────────────────────────────────────
    data.outlierScore = data.subs > 0 ? outlierScore(data.views, data.subs) : 50;
    data.monetized = data.subs >= 1000 ? "likely" : data.subs >= 500 ? "possible" : "unlikely";

    // ── Top videos (channel page) ────────────────────────────────────────────
    data.videos = [];
    if (onVideo && data.pageTitle) {
      data.videos = [{ title: data.pageTitle, viewsText: data.viewsText || "—", views: data.views, score: data.outlierScore }];
    } else {
      const renderers = document.querySelectorAll("ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-video-renderer");
      renderers.forEach((el, i) => {
        if (i >= 8) return;
        const title = el.querySelector("#video-title, .title, a#video-title-link")?.textContent?.trim() || "";
        let vText = "";
        for (const span of el.querySelectorAll("#metadata-line span, .ytd-video-meta-block span")) {
          const t = span.textContent?.trim() || "";
          if (/view/i.test(t) || /\d/.test(t)) { vText = t; break; }
        }
        if (!title) return;
        const views = parseCount(vText.replace(/\s*views?/i, "").trim());
        data.videos.push({ title, viewsText: vText || "—", views, score: outlierScore(views, data.subs) });
      });
    }

    if (data.videos.length > 0) {
      const avg = data.videos.reduce((a, v) => a + v.score, 0) / data.videos.length;
      data.avgScore = Math.round(avg);
    } else {
      data.avgScore = data.outlierScore;
    }

    // ── SEO Analysis ─────────────────────────────────────────────────────────
    const titleLen = data.pageTitle.length;
    const tagCount = data.tags.length;
    const descWords = data.description.split(/\s+/).filter(Boolean).length;

    data.seo = {
      titleLength: titleLen,
      titleScore: titleLen >= 40 && titleLen <= 70 ? "good" : titleLen > 70 ? "too long" : "too short",
      descWords,
      descScore: descWords >= 80 ? "good" : descWords >= 30 ? "ok" : "too short",
      tagCount,
      tagScore: tagCount >= 8 ? "good" : tagCount >= 3 ? "ok" : "missing",
      hasKeywordInTitle: data.tags.some(tag => data.pageTitle.toLowerCase().includes(tag.toLowerCase())),
      hasOgTags: Object.keys(data.ogTags).length > 0,
    };

    return data;
  }

  // ── Build panel HTML ───────────────────────────────────────────────────────

  function buildOverviewTab(data) {
    const outlierBadge = data.avgScore >= 75
      ? '<span class="th-badge th-badge-green">🔥 Outlier</span>'
      : data.avgScore >= 50
      ? '<span class="th-badge th-badge-cyan">📊 Average</span>'
      : '<span class="th-badge th-badge-yellow">💤 Below Avg</span>';

    const monetBadge = {
      likely:   '<span class="th-badge th-badge-green">✓ Monetized</span>',
      possible: '<span class="th-badge th-badge-yellow">~ Possibly</span>',
      unlikely: '<span class="th-badge th-badge-red">✗ Unlikely</span>',
    }[data.monetized];

    const videoRows = data.videos.length > 0
      ? data.videos.map(v => `
          <div class="th-video-row">
            <div class="th-video-title" title="${v.title}">${v.title}</div>
            <div class="th-video-score ${scoreClass(v.score)}">${v.score}</div>
            <div class="th-score-bar" style="width:36px">
              <div class="th-score-fill" style="width:${v.score}%;background:${scoreColor(v.score)}"></div>
            </div>
          </div>`).join("")
      : '<p style="font-size:11px;color:#64748b;text-align:center;padding:8px 0">Visit the Videos tab for per-video scores</p>';

    return `
      <!-- Score card -->
      ${data.context === "video" ? `
      <div class="th-section">
        <div class="th-section-title">Current Video Outlier Score</div>
        <div class="th-metric" style="background:rgba(0,212,255,0.04);border-color:rgba(0,212,255,0.18)">
          <div style="font-size:11px;color:#cbd5e1;margin-bottom:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${data.pageTitle}">${data.pageTitle}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:10px;color:#64748b">${data.viewsText || "—"}</span>
            <span style="font-size:24px;font-weight:800;color:${scoreColor(data.avgScore)}">${data.avgScore}</span>
          </div>
          <div class="th-score-bar"><div class="th-score-fill" style="width:${data.avgScore}%;background:${scoreColor(data.avgScore)}"></div></div>
        </div>
      </div>` : ""}

      <!-- Channel overview -->
      <div class="th-section">
        <div class="th-section-title">Channel Overview</div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;gap:6px">
          <div style="font-size:13px;font-weight:700;color:#fff;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${data.name}</div>
          ${outlierBadge}
        </div>
        <div class="th-metric-grid">
          <div class="th-metric">
            <div class="th-metric-label">Subscribers</div>
            <div class="th-metric-value" style="color:#00D4FF;font-size:14px">${data.subsText || "—"}</div>
          </div>
          <div class="th-metric">
            <div class="th-metric-label">Videos</div>
            <div class="th-metric-value">${data.videoCount}</div>
          </div>
        </div>
        ${data.duration ? `<div style="margin-top:8px;font-size:10px;color:#64748b">Duration: <strong style="color:#94a3b8">${data.duration}</strong>&nbsp; Uploaded: <strong style="color:#94a3b8">${data.uploadDate}</strong></div>` : ""}
        ${data.subs === 0 && data.context === "video" ? '<p style="font-size:10px;color:#facc15;margin:6px 0 0">⚠ Sub count hidden — visit channel page for full data</p>' : ""}
      </div>

      <!-- Avg outlier -->
      <div class="th-section">
        <div class="th-section-title">Outlier Score</div>
        <div class="th-metric" style="background:rgba(0,212,255,0.04);border-color:rgba(0,212,255,0.18)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:11px;color:#94a3b8">Avg. video performance vs subs</span>
            <span style="font-size:22px;font-weight:800;color:${scoreColor(data.avgScore)}">${data.avgScore}</span>
          </div>
          <div class="th-score-bar"><div class="th-score-fill" style="width:${data.avgScore}%;background:${scoreColor(data.avgScore)}"></div></div>
        </div>
      </div>

      <!-- Monetization -->
      <div class="th-section">
        <div class="th-section-title">Monetization</div>
        <div style="display:flex;align-items:center;gap:8px">
          ${monetBadge}
          <span style="font-size:10px;color:#64748b">${data.subs >= 1000 ? "Meets YPP threshold" : data.subs >= 500 ? "Getting close to 1K" : "Below 1K subs"}</span>
        </div>
      </div>

      <!-- Top Videos -->
      <div class="th-section" style="margin-bottom:0">
        <div class="th-section-title">${data.context === "video" ? "This Video" : "Top Videos"} — Outlier Score</div>
        ${videoRows}
      </div>
    `;
  }

  function buildTagsTab(data) {
    const tagsHtml = data.tags.length > 0
      ? `<div class="th-tags-wrap">${data.tags.map(t => `<span class="th-tag">${t}</span>`).join("")}</div>`
      : '<p style="font-size:11px;color:#64748b">No tags detected on this page.</p>';

    const descHtml = data.description
      ? `<div class="th-desc">${data.description.slice(0, 1200)}${data.description.length > 1200 ? "…" : ""}</div>`
      : '<p style="font-size:11px;color:#64748b">No description found.</p>';

    const ogRows = Object.entries(data.ogTags).map(([key, val]) => `
      <div class="th-seo-row">
        <span class="th-seo-label">${key.replace("og:", "")}</span>
        <span style="font-size:10px;color:#94a3b8;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${val}">${val}</span>
      </div>`).join("") || '<p style="font-size:11px;color:#64748b">No Open Graph tags found.</p>';

    return `
      <div class="th-section">
        <div class="th-section-title">Video / Channel Tags (${data.tags.length})</div>
        ${tagsHtml}
      </div>
      <div class="th-section">
        <div class="th-section-title">Description</div>
        ${descHtml}
      </div>
      <div class="th-section" style="margin-bottom:0">
        <div class="th-section-title">Open Graph Meta Tags</div>
        ${ogRows}
      </div>
    `;
  }

  function buildSeoTab(data) {
    const s = data.seo;

    function seoColor(score) {
      if (score === "good") return "#34D399";
      if (score === "ok") return "#FCD34D";
      return "#f87171";
    }

    const ogBadge = s.hasOgTags
      ? '<span class="th-badge th-badge-green" style="font-size:9px">✓ Present</span>'
      : '<span class="th-badge th-badge-red" style="font-size:9px">✗ Missing</span>';

    const kwBadge = s.hasKeywordInTitle
      ? '<span class="th-badge th-badge-green" style="font-size:9px">✓ Yes</span>'
      : '<span class="th-badge th-badge-yellow" style="font-size:9px">~ No</span>';

    const overallIssues = [];
    if (s.titleScore !== "good") overallIssues.push(`Title is ${s.titleScore} (${s.titleLength} chars, aim 40–70)`);
    if (s.descScore !== "good") overallIssues.push(`Description ${s.descScore} (${s.descWords} words, aim 80+)`);
    if (s.tagScore !== "good") overallIssues.push(`Only ${s.tagCount} tags (aim 8–15)`);
    if (!s.hasKeywordInTitle) overallIssues.push("No tags appear in title");
    if (!s.hasOgTags) overallIssues.push("No Open Graph tags detected");

    const overallScore = Math.round(((s.titleScore === "good" ? 1 : 0.5) + (s.descScore === "good" ? 1 : 0.5) + (s.tagScore === "good" ? 1 : 0.5) + (s.hasKeywordInTitle ? 1 : 0) + (s.hasOgTags ? 1 : 0)) / 5 * 100);

    return `
      <div class="th-section">
        <div class="th-section-title">SEO Score</div>
        <div class="th-metric" style="background:rgba(0,212,255,0.04);border-color:rgba(0,212,255,0.18)">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:11px;color:#94a3b8">Overall SEO health</span>
            <span style="font-size:22px;font-weight:800;color:${scoreColor(overallScore)}">${overallScore}</span>
          </div>
          <div class="th-score-bar"><div class="th-score-fill" style="width:${overallScore}%;background:${scoreColor(overallScore)}"></div></div>
        </div>
      </div>

      <div class="th-section">
        <div class="th-section-title">SEO Breakdown</div>
        <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:4px 12px">
          <div class="th-seo-row">
            <span class="th-seo-label">Title length</span>
            <span class="th-seo-val" style="color:${seoColor(s.titleScore)}">${s.titleLength} chars</span>
          </div>
          <div class="th-seo-row">
            <span class="th-seo-label">Description</span>
            <span class="th-seo-val" style="color:${seoColor(s.descScore)}">${s.descWords} words</span>
          </div>
          <div class="th-seo-row">
            <span class="th-seo-label">Tags count</span>
            <span class="th-seo-val" style="color:${seoColor(s.tagScore)}">${s.tagCount} tags</span>
          </div>
          <div class="th-seo-row">
            <span class="th-seo-label">Keyword in title</span>
            ${kwBadge}
          </div>
          <div class="th-seo-row">
            <span class="th-seo-label">OG / Social tags</span>
            ${ogBadge}
          </div>
        </div>
      </div>

      ${overallIssues.length > 0 ? `
      <div class="th-section" style="margin-bottom:0">
        <div class="th-section-title">Issues to Fix</div>
        <div style="display:flex;flex-direction:column;gap:5px">
          ${overallIssues.map(issue => `
            <div style="display:flex;align-items:flex-start;gap:8px;padding:7px 10px;border-radius:8px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.15)">
              <span style="color:#f87171;font-size:11px;flex-shrink:0">⚠</span>
              <span style="font-size:11px;color:#94a3b8;line-height:1.4">${issue}</span>
            </div>`).join("")}
        </div>
      </div>` : `
      <div style="padding:14px;border-radius:10px;background:rgba(52,211,153,0.06);border:1px solid rgba(52,211,153,0.15);text-align:center">
        <span style="font-size:11px;color:#34d399;font-weight:600">✓ No major SEO issues found</span>
      </div>`}
    `;
  }

  function buildPanel(data) {
    const tabContent = activeTab === "overview"
      ? buildOverviewTab(data)
      : activeTab === "tags"
      ? buildTagsTab(data)
      : buildSeoTab(data);

    return `
      <div id="th-header">
        <div id="th-logo">
          <div id="th-logo-icon">⚡</div>
          <div>
            <div id="th-logo-text">Townshub</div>
            <div id="th-logo-sub">${data.context === "video" ? "Video Analyzer" : "Channel Analyzer"}</div>
          </div>
        </div>
        <button id="th-close" title="Close panel">✕</button>
      </div>

      <div id="th-tabs">
        <button class="th-tab ${activeTab === "overview" ? "th-active" : ""}" data-tab="overview">Overview</button>
        <button class="th-tab ${activeTab === "tags" ? "th-active" : ""}" data-tab="tags">Tags & Desc</button>
        <button class="th-tab ${activeTab === "seo" ? "th-active" : ""}" data-tab="seo">SEO</button>
      </div>

      <div id="th-body">${tabContent}</div>

      <div id="th-footer">
        <span>Powered by Townshub</span>
        <a href="https://townshub-faceless.vercel.app/dashboard" target="_blank">Open Dashboard →</a>
      </div>
    `;
  }

  // ── Inject / remove panel ──────────────────────────────────────────────────

  function isChannelPage() {
    return (
      location.pathname.includes("/@") ||
      location.pathname.includes("/channel/") ||
      location.pathname.includes("/user/") ||
      location.pathname.includes("/c/") ||
      location.pathname === "/watch"
    );
  }

  function removePanel() {
    panel?.remove(); trigger?.remove();
    panel = null; trigger = null;
  }

  function bindPanelEvents(data) {
    panel.querySelector("#th-close").addEventListener("click", () => {
      panel.classList.add("th-hidden");
      trigger?.classList.remove("th-panel-open");
    });
    panel.querySelectorAll(".th-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        activeTab = btn.dataset.tab;
        panel.innerHTML = buildPanel(data);
        bindPanelEvents(data);
      });
    });
  }

  function injectTrigger() {
    if (trigger || document.getElementById("th-trigger")) return;
    trigger = document.createElement("button");
    trigger.id = "th-trigger";
    trigger.title = "Analyze with Townshub";
    trigger.textContent = "⚡";
    trigger.addEventListener("click", () => {
      if (panel) {
        panel.classList.toggle("th-hidden");
        trigger.classList.toggle("th-panel-open", !panel.classList.contains("th-hidden"));
      } else {
        injectPanel();
      }
    });
    document.body.appendChild(trigger);
  }

  function injectPanel() {
    if (panel) { panel.classList.remove("th-hidden"); return; }

    panel = document.createElement("div");
    panel.id = "th-panel";
    panel.innerHTML = `
      <div id="th-header">
        <div id="th-logo">
          <div id="th-logo-icon">⚡</div>
          <div>
            <div id="th-logo-text">Townshub</div>
            <div id="th-logo-sub">Analyzing…</div>
          </div>
        </div>
        <button id="th-close">✕</button>
      </div>
      <div id="th-body">
        <div class="th-loading">
          <div class="th-spinner"></div>
          Deep-scanning channel data…
        </div>
      </div>`;
    document.body.appendChild(panel);

    panel.querySelector("#th-close").addEventListener("click", () => {
      panel.classList.add("th-hidden");
      trigger?.classList.remove("th-panel-open");
    });
    trigger?.classList.add("th-panel-open");

    const delay = isVideoPage() ? 2200 : 1400;
    setTimeout(() => {
      const data = scrapeAll();

      // Retry once if channel name not found yet
      if (data.name === "Unknown Channel") {
        setTimeout(() => {
          const retryData = scrapeAll();
          if (panel) { panel.innerHTML = buildPanel(retryData); bindPanelEvents(retryData); }
        }, 1500);
        return;
      }

      if (panel) { panel.innerHTML = buildPanel(data); bindPanelEvents(data); }
    }, delay);
  }

  // ── Route change watcher ───────────────────────────────────────────────────

  function onNavigate() {
    const newUrl = location.href;
    if (newUrl === currentUrl) return;
    currentUrl = newUrl;
    activeTab = "overview";
    removePanel();
    setTimeout(init, 1500);
  }

  function init() {
    if (!isChannelPage()) return;
    injectTrigger();
  }

  const observer = new MutationObserver(onNavigate);
  observer.observe(document.body, { childList: true, subtree: true });

  const _push = history.pushState.bind(history);
  history.pushState = function (...args) { _push(...args); setTimeout(onNavigate, 100); };
  window.addEventListener("popstate", () => setTimeout(onNavigate, 100));

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 1000));
  } else {
    setTimeout(init, 1000);
  }
})();
