// Townshub YouTube Channel Analyzer — Content Script
// Manifest V3 compatible

(function () {
  "use strict";

  let panel = null;
  let trigger = null;
  let currentUrl = location.href;

  // ── Utility ────────────────────────────────────────────────────────────────

  function formatNumber(n) {
    if (!n && n !== 0) return "—";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return String(n);
  }

  function parseCount(text) {
    if (!text) return 0;
    text = text.replace(/,/g, "").toLowerCase();
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

  function scoreColor(score) {
    if (score >= 75) return "#34D399";
    if (score >= 50) return "#00D4FF";
    return "#FCD34D";
  }

  function scoreClass(score) {
    if (score >= 75) return "th-score-high";
    if (score >= 50) return "th-score-medium";
    return "th-score-low";
  }

  // ── Scrape channel data from the DOM ───────────────────────────────────────

  function scrapeChannelData() {
    const data = {};

    // Channel name
    data.name =
      document.querySelector("ytd-channel-name yt-formatted-string")?.textContent?.trim() ||
      document.querySelector("#channel-name .ytd-channel-name")?.textContent?.trim() ||
      document.title.replace(" - YouTube", "").trim() ||
      "Unknown Channel";

    // Subscriber count
    const subEl =
      document.querySelector("#subscriber-count") ||
      document.querySelector("yt-formatted-string#subscriber-count") ||
      document.querySelector("[id*='subscriber']");
    const subText = subEl?.textContent?.trim() || "";
    data.subsText = subText || "—";
    data.subs = parseCount(subText.replace(/\s*(subscribers?|member)/gi, ""));

    // Video count
    const metaItems = [...document.querySelectorAll("#videos-count, .yt-content-metadata-view-model-wiz__metadata-text")];
    data.videoCount = "—";
    for (const el of metaItems) {
      const text = el.textContent?.trim() || "";
      if (/\d/.test(text) && /video/i.test(text)) {
        data.videoCount = text.replace(/\s*videos?/i, "").trim();
        break;
      }
    }

    // Channel join date / views from about page metadata
    data.totalViews = "—";
    data.joinedDate = "—";
    const aboutMeta = [...document.querySelectorAll("yt-content-metadata-view-model-wiz__metadata-text, #additional-info-container span")];
    for (const el of aboutMeta) {
      const text = el.textContent?.trim() || "";
      if (/view/i.test(text)) data.totalViews = text;
      if (/joined/i.test(text)) data.joinedDate = text;
    }

    // Top videos — scrape from channel videos tab
    data.videos = [];
    const videoRenderers = document.querySelectorAll("ytd-rich-item-renderer, ytd-grid-video-renderer");
    videoRenderers.forEach((el, i) => {
      if (i >= 6) return;
      const titleEl = el.querySelector("#video-title, .title");
      const viewEl  = el.querySelector(".ytd-video-meta-block span, #metadata-line span");
      const title   = titleEl?.textContent?.trim() || "";
      const viewsText = viewEl?.textContent?.trim() || "";
      if (!title) return;
      const views = parseCount(viewsText.replace(/\s*views?/i, "").trim());
      const score = outlierScore(views, data.subs);
      data.videos.push({ title, viewsText: viewsText || "—", views, score });
    });

    // Tags — from meta tags
    data.tags = [];
    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (keywordsMeta) {
      data.tags = keywordsMeta.content.split(",").map(t => t.trim()).filter(Boolean).slice(0, 8);
    }

    // Monetization heuristic — channels with >1K subs + consistent uploads
    data.monetized = data.subs >= 1000 ? "likely" : data.subs >= 500 ? "possible" : "unlikely";

    // Average outlier score from videos
    if (data.videos.length > 0) {
      const avg = data.videos.reduce((a, v) => a + v.score, 0) / data.videos.length;
      data.avgOutlierScore = Math.round(avg);
    } else {
      data.avgOutlierScore = outlierScore(data.subs * 0.5, data.subs);
    }

    return data;
  }

  // ── Build panel HTML ───────────────────────────────────────────────────────

  function buildPanel(data) {
    const monetBadge = {
      likely:   '<span class="th-badge th-badge-green">✓ Monetized</span>',
      possible: '<span class="th-badge th-badge-yellow">~ Possibly</span>',
      unlikely: '<span class="th-badge th-badge-red">✗ Unlikely</span>',
    }[data.monetized];

    const outlierBadge = data.avgOutlierScore >= 75
      ? '<span class="th-badge th-badge-green">🔥 Outlier Channel</span>'
      : data.avgOutlierScore >= 50
      ? '<span class="th-badge th-badge-cyan">📊 Average</span>'
      : '<span class="th-badge th-badge-yellow">💤 Below Avg</span>';

    const videoRows = data.videos.length > 0
      ? data.videos.map(v => `
          <div class="th-video-row">
            <div class="th-video-title" title="${v.title}">${v.title}</div>
            <div class="th-video-score ${scoreClass(v.score)}">${v.score}</div>
            <div class="th-score-bar" style="width:40px">
              <div class="th-score-fill" style="width:${v.score}%;background:${scoreColor(v.score)}"></div>
            </div>
          </div>`).join("")
      : '<p style="font-size:11px;color:#475569;text-align:center;padding:8px">Visit the Videos tab for per-video scores</p>';

    const tags = data.tags.length > 0
      ? data.tags.map(t => `<span class="th-tag">${t}</span>`).join("")
      : '<span style="font-size:10px;color:#475569">No tags detected</span>';

    return `
      <div id="th-header">
        <div id="th-logo">
          <div id="th-logo-icon">⚡</div>
          <div>
            <div id="th-logo-text">Townshub</div>
            <div id="th-logo-sub">Channel Analyzer</div>
          </div>
        </div>
        <button id="th-close" title="Close">✕</button>
      </div>

      <div id="th-body">
        <!-- Channel overview -->
        <div class="th-section">
          <div class="th-section-title">Channel Overview</div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;gap:6px;flex-wrap:wrap">
            <div style="font-size:13px;font-weight:700;color:#fff;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${data.name}</div>
            ${outlierBadge}
          </div>
          <div class="th-metric-grid">
            <div class="th-metric">
              <div class="th-metric-label">Subscribers</div>
              <div class="th-metric-value" style="color:#00D4FF">${data.subsText || "—"}</div>
            </div>
            <div class="th-metric">
              <div class="th-metric-label">Videos</div>
              <div class="th-metric-value">${data.videoCount}</div>
            </div>
          </div>
        </div>

        <!-- Outlier Score -->
        <div class="th-section">
          <div class="th-section-title">Outlier Score</div>
          <div class="th-metric" style="background:rgba(0,212,255,0.04);border-color:rgba(0,212,255,0.15)">
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span style="font-size:11px;color:#94a3b8">Avg. video performance vs subs</span>
              <span style="font-size:20px;font-weight:800;color:${scoreColor(data.avgOutlierScore)}">${data.avgOutlierScore}</span>
            </div>
            <div class="th-score-bar">
              <div class="th-score-fill" style="width:${data.avgOutlierScore}%;background:${scoreColor(data.avgOutlierScore)}"></div>
            </div>
          </div>
        </div>

        <!-- Monetization -->
        <div class="th-section">
          <div class="th-section-title">Monetization Status</div>
          <div style="display:flex;align-items:center;gap:8px">
            ${monetBadge}
            <span style="font-size:10px;color:#475569">${data.subs >= 1000 ? "Meets YPP threshold" : data.subs >= 500 ? "Getting close to 1K" : "Below 1K subs"}</span>
          </div>
        </div>

        <!-- Top Videos -->
        <div class="th-section">
          <div class="th-section-title">Top Videos — Outlier Score</div>
          ${videoRows}
        </div>

        <!-- Tags -->
        <div class="th-section" style="margin-bottom:0">
          <div class="th-section-title">Channel Tags</div>
          <div style="display:flex;flex-wrap:wrap">${tags}</div>
        </div>
      </div>

      <div id="th-footer">
        <span style="font-size:10px;color:#475569">Powered by Townshub Faceless</span>
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
      location.pathname.includes("/c/")
    );
  }

  function removePanel() {
    panel?.remove();
    trigger?.remove();
    panel = null;
    trigger = null;
  }

  function injectTrigger() {
    if (trigger || document.getElementById("th-trigger")) return;

    trigger = document.createElement("button");
    trigger.id = "th-trigger";
    trigger.title = "Analyze this channel";
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

    // Loading state
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
      <div class="th-loading">
        <div class="th-spinner"></div>
        Scraping channel data…
      </div>`;

    document.body.appendChild(panel);

    // Bind close
    panel.querySelector("#th-close").addEventListener("click", () => {
      panel.classList.add("th-hidden");
      trigger?.classList.remove("th-panel-open");
    });

    trigger?.classList.add("th-panel-open");

    // Scrape then render
    setTimeout(() => {
      const data = scrapeChannelData();
      panel.innerHTML = buildPanel(data);
      panel.querySelector("#th-close").addEventListener("click", () => {
        panel.classList.add("th-hidden");
        trigger?.classList.remove("th-panel-open");
      });
    }, 800);
  }

  // ── Route change watcher (YouTube is a SPA) ────────────────────────────────

  function onNavigate() {
    const newUrl = location.href;
    if (newUrl === currentUrl) return;
    currentUrl = newUrl;
    removePanel();
    setTimeout(init, 1500);
  }

  function init() {
    if (!isChannelPage()) return;
    injectTrigger();
  }

  // Observe URL changes
  const observer = new MutationObserver(onNavigate);
  observer.observe(document.body, { childList: true, subtree: true });

  // Also override pushState / replaceState
  const _push = history.pushState.bind(history);
  history.pushState = function (...args) {
    _push(...args);
    setTimeout(onNavigate, 100);
  };

  window.addEventListener("popstate", () => setTimeout(onNavigate, 100));

  // Initial load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 1000));
  } else {
    setTimeout(init, 1000);
  }
})();
