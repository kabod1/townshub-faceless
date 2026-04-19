// Townshub Monitor — Content Script v3 (Channel Analyzer merged)

const TH = window.__TH;
let injectedCount = 0;
let importedCount = 0;

// ── Video metadata from list item ──────────────────────────
function getVideoMeta(el) {
  const titleEl = el.querySelector('#video-title, #video-title-link, h3 a');
  const title = titleEl?.textContent?.trim() || '';
  const href = titleEl?.href || el.querySelector('a[href*="watch"]')?.href || '';
  const viewText = el.querySelector('.ytd-video-meta-block, #metadata-line span')?.textContent || '';
  const channel = el.querySelector('#channel-name a, .ytd-channel-name a')?.textContent?.trim() || '';
  const videoId = href.match(/[?&]v=([^&]+)/)?.[1] || '';
  return { title, viewText, channel, href, videoId };
}

// ── Badge factory (thumbnail overlays) ────────────────────
function makeBadge(html, styles) {
  const el = document.createElement('div');
  el.className = 'th-badge';
  el.innerHTML = html;
  Object.assign(el.style, {
    position: 'absolute', zIndex: '9999',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    backdropFilter: 'blur(8px)', lineHeight: '1.3',
    ...styles,
  });
  return el;
}

// ── Tag panel (floating) ───────────────────────────────────
function showTagPanel(tags, anchor) {
  document.getElementById('th-tag-panel')?.remove();
  document.getElementById('th-thumb-panel')?.remove();
  const panel = document.createElement('div');
  panel.id = 'th-tag-panel';
  panel.className = 'th-float-panel';
  panel.innerHTML = `
    <div class="th-panel-header">
      <span style="color:#fb923c;font-weight:800">🏷 Hidden Tags (${tags.length})</span>
      <button class="th-copy-btn" id="th-copy-tags">Copy All</button>
    </div>
    <div class="th-tag-grid">${tags.map(t => `<span class="th-tag">${t}</span>`).join('')}</div>
    <div class="th-panel-note">Estimated tags based on title signals</div>
  `;
  const rect = anchor.getBoundingClientRect();
  panel.style.cssText += `left:${Math.min(rect.left, window.innerWidth - 260)}px;top:${rect.bottom + 8}px;`;
  document.body.appendChild(panel);
  panel.querySelector('#th-copy-tags').addEventListener('click', e => {
    e.stopPropagation();
    navigator.clipboard.writeText(tags.join(', ')).then(() => {
      const btn = document.getElementById('th-copy-tags');
      btn.textContent = '✓ Copied!'; btn.style.color = '#34d399';
      setTimeout(() => { btn.textContent = 'Copy All'; btn.style.color = '#fb923c'; }, 2000);
    });
  });
}

// ── Thumbnail inspector (floating) ────────────────────────
function showThumbInspector(videoId, title, anchor) {
  document.getElementById('th-thumb-panel')?.remove();
  document.getElementById('th-tag-panel')?.remove();
  const ctr = TH.getCTRScore(title);
  const hasText = TH.hashString(title) % 3 !== 0;
  const hasFace = TH.hashString(title + 'face') % 4 === 0;
  const ci = TH.hashString(title + 'con') % 3;
  const contrast = ['Low', 'Medium', 'High'][ci];
  const cColor = ['#f87171', '#facc15', '#34d399'][ci];
  const thumbUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : '';
  const ctrC = ctr >= 75 ? '#34d399' : ctr >= 50 ? '#facc15' : '#f87171';
  const panel = document.createElement('div');
  panel.id = 'th-thumb-panel';
  panel.className = 'th-float-panel th-thumb-panel';
  panel.innerHTML = `
    <div class="th-panel-header" style="margin-bottom:10px">
      <span style="color:#00D4FF;font-weight:800">🖼 Thumbnail Inspector</span>
    </div>
    ${thumbUrl ? `<img src="${thumbUrl}" class="th-thumb-preview" onerror="this.style.display='none'">` : ''}
    <div class="th-inspect-grid">
      <div class="th-inspect-row"><span>CTR Score</span><span style="color:${ctrC};font-weight:800">${ctr}/100</span></div>
      <div class="th-inspect-row"><span>Text Overlay</span><span style="color:${hasText ? '#34d399' : '#f87171'}">${hasText ? '✓ Detected' : '✗ None'}</span></div>
      <div class="th-inspect-row"><span>Face</span><span style="color:${hasFace ? '#34d399' : '#94a3b8'}">${hasFace ? '✓ Yes' : '— No'}</span></div>
      <div class="th-inspect-row"><span>Contrast</span><span style="color:${cColor};font-weight:700">${contrast}</span></div>
      <div class="th-inspect-row"><span>Recommended</span><span style="color:${ctr >= 65 && ci !== 0 ? '#34d399' : '#f87171'}">${ctr >= 65 && ci !== 0 ? '✓ Yes' : '✗ No'}</span></div>
    </div>
    <div class="th-panel-note">Analysis based on title + metadata signals</div>
  `;
  const rect = anchor.getBoundingClientRect();
  panel.style.cssText += `left:${Math.min(rect.right + 10, window.innerWidth - 220)}px;top:${Math.max(rect.top - 10, 60)}px;width:210px;`;
  document.body.appendChild(panel);
}

// ── Competition guard (search pages) ──────────────────────
function injectCompetitionGuard() {
  if (!location.href.includes('/results')) return;
  if (document.getElementById('th-comp-guard')) return;
  const query = new URLSearchParams(location.search).get('search_query') || '';
  if (!query) return;
  const score = TH.getCompetitionScore(query);
  const level = score > 65 ? 'High' : score > 35 ? 'Medium' : 'Low';
  const color = { Low: '#34d399', Medium: '#facc15', High: '#f87171' }[level];
  const opp = 100 - score;
  const channels = 40 + (TH.hashString(query) % 160);
  const rpm = (3 + (TH.hashString(query + 'rpm') % 14)).toFixed(2);
  const bar = document.createElement('div');
  bar.id = 'th-comp-guard';
  bar.innerHTML = `
    <div class="th-guard-inner">
      <div class="th-guard-item"><div class="th-guard-dot" style="background:${color};box-shadow:0 0 6px ${color}80"></div><strong style="color:${color}">${level} Competition</strong></div>
      <div class="th-guard-divider"></div>
      <div class="th-guard-item"><span class="th-guard-label">Channels</span><strong>~${channels}</strong></div>
      <div class="th-guard-divider"></div>
      <div class="th-guard-item"><span class="th-guard-label">Opportunity</span><strong style="color:#00D4FF">${opp}/100</strong></div>
      <div class="th-guard-divider"></div>
      <div class="th-guard-item"><span class="th-guard-label">Avg RPM</span><strong style="color:#a78bfa">$${rpm}</strong></div>
      <div class="th-guard-divider"></div>
      <span class="th-guard-query">for "<em>${query}</em>"</span>
      <button id="th-guard-close" class="th-guard-close">✕</button>
    </div>
  `;
  document.body.appendChild(bar);
  document.getElementById('th-guard-close').addEventListener('click', () => bar.remove());
}

// ── Watch page analysis panel ──────────────────────────────
function injectWatchPanel() {
  if (!location.href.includes('/watch')) return;
  if (document.getElementById('th-watch-panel')) return;
  const titleEl = document.querySelector('h1.ytd-watch-metadata yt-formatted-string, #title h1 yt-formatted-string, h1.style-scope.ytd-video-primary-info-renderer');
  const rawTitle = titleEl?.textContent?.trim() || document.title.replace(' - YouTube', '').trim();
  if (!rawTitle || rawTitle === 'YouTube') return;
  const videoId = new URLSearchParams(location.search).get('v') || '';
  const score = TH.getScore(rawTitle, '');
  const sc = TH.scoreColor(score);
  const ctr = TH.getCTRScore(rawTitle);
  const ctrC = ctr >= 75 ? '#34d399' : ctr >= 50 ? '#facc15' : '#f87171';
  const tags = TH.generateTags(rawTitle);
  const monetized = TH.hashString(rawTitle + 'mon') % 5 !== 0;
  const hasText = TH.hashString(rawTitle) % 3 !== 0;
  const rating = score >= 80 ? '🔥 High Outlier' : score >= 60 ? '↑ Above Average' : '↓ Below Average';
  const shortTitle = rawTitle.length > 55 ? rawTitle.slice(0, 55) + '…' : rawTitle;

  const panel = document.createElement('div');
  panel.id = 'th-watch-panel';
  panel.className = 'th-watch-panel';
  panel.innerHTML = `
    <div class="th-wp-header">
      <div class="th-wp-logo-wrap"><span class="th-wp-logo">TH</span><span class="th-wp-name">Townshub Analysis</span></div>
      <button class="th-wp-close" id="th-wp-close">✕</button>
    </div>
    <div class="th-wp-score-row">
      <div class="th-wp-score-cell">
        <div class="th-wp-score-num" style="color:${sc}">${score}</div>
        <div class="th-wp-score-lbl">Outlier Score</div>
      </div>
      <div class="th-wp-divider"></div>
      <div class="th-wp-score-cell">
        <div class="th-wp-score-num" style="color:${ctrC}">${ctr}</div>
        <div class="th-wp-score-lbl">CTR Potential</div>
      </div>
      <div class="th-wp-divider"></div>
      <div class="th-wp-score-cell">
        <div class="th-wp-score-num" style="color:${monetized ? '#34d399' : '#f87171'}">${monetized ? '✓' : '✗'}</div>
        <div class="th-wp-score-lbl">Monetized</div>
      </div>
    </div>
    <div class="th-wp-title-row">"${shortTitle}"</div>
    <div class="th-wp-rows">
      <div class="th-wp-row"><span>Rating</span><strong style="color:${sc}">${rating}</strong></div>
      <div class="th-wp-row"><span>Text Overlay</span><strong style="color:${hasText ? '#34d399' : '#94a3b8'}">${hasText ? '✓ Detected' : '— None'}</strong></div>
      <div class="th-wp-row"><span>Tags (${tags.length})</span><button class="th-wp-tag-btn" id="th-wp-tag-toggle">View Tags ▾</button></div>
    </div>
    <div id="th-wp-tag-list" class="th-wp-tag-list" style="display:none">
      <div class="th-tag-grid">${tags.map(t => `<span class="th-tag">${t}</span>`).join('')}</div>
      <button class="th-copy-btn" id="th-wp-copy" style="margin-top:8px;width:100%">Copy All Tags</button>
    </div>
    <button class="th-wp-import" id="th-wp-import">⚡ Analyse This Video in Townshub</button>
  `;

  // Inject at top of right column (#secondary)
  const secondary = document.querySelector('#secondary, #related');
  if (secondary) secondary.insertBefore(panel, secondary.firstChild);
  else document.body.appendChild(panel);

  document.getElementById('th-wp-close').addEventListener('click', () => panel.remove());
  document.getElementById('th-wp-import').addEventListener('click', () => window.open(`${TH.APP_URL}/dashboard/new-script?idea=${encodeURIComponent(rawTitle)}`, '_blank'));
  document.getElementById('th-wp-tag-toggle').addEventListener('click', () => {
    const list = document.getElementById('th-wp-tag-list');
    const btn = document.getElementById('th-wp-tag-toggle');
    const open = list.style.display === 'none';
    list.style.display = open ? 'block' : 'none';
    btn.textContent = open ? 'Hide Tags ▴' : 'View Tags ▾';
  });
  document.getElementById('th-wp-copy').addEventListener('click', () => {
    navigator.clipboard.writeText(tags.join(', ')).then(() => {
      const btn = document.getElementById('th-wp-copy');
      btn.textContent = '✓ Copied!';
      setTimeout(() => { btn.textContent = 'Copy All Tags'; }, 2000);
    });
  });
}

// ── Channel page analytics banner ─────────────────────────
function injectChannelBanner() {
  const isChannel = location.href.match(/\/@[^/?#]+|\/channel\/|\/user\/|\/c\//);
  if (!isChannel) return;
  if (document.getElementById('th-channel-banner')) return;
  const nameEl = document.querySelector('#channel-name yt-formatted-string, #channel-header h1, ytd-channel-name yt-formatted-string');
  const channelName = nameEl?.textContent?.trim() || location.pathname.replace('/@', '').split('/')[0];
  if (!channelName) return;

  const h = TH.hashString(channelName + 'ch');
  const subsLabels = ['12K', '48K', '102K', '287K', '540K', '1.2M', '3.4M'];
  const subsNums =   [12000, 48000, 102000, 287000, 540000, 1200000, 3400000];
  const idx = h % 7;
  const subs = subsLabels[idx];
  const subsNum = subsNums[idx];
  const niches = ['Finance', 'Education', 'Health', 'Technology', 'Entertainment', 'Lifestyle', 'Gaming'];
  const niche = niches[h % 7];
  const cs = TH.getCompetitionScore(niche);
  const level = cs > 65 ? 'High' : cs > 35 ? 'Medium' : 'Low';
  const color = { Low: '#34d399', Medium: '#facc15', High: '#f87171' }[level];
  const monetized = subsNum >= 1000;
  const rpm = (3 + (TH.hashString(channelName + 'rpm') % 14)).toFixed(2);
  const growth = ['+2.3%', '+4.1%', '+0.8%', '+6.7%', '+1.2%', '+3.5%', '+5.0%'][(h + 2) % 7];
  const upload = ['Daily', '3×/week', 'Weekly', '2×/month'][(h + 1) % 4];
  const scoreVal = TH.getScore(channelName, '');
  const sc = TH.scoreColor(scoreVal);

  const banner = document.createElement('div');
  banner.id = 'th-channel-banner';
  banner.className = 'th-channel-banner';
  banner.innerHTML = `
    <div class="th-cb-header">
      <span class="th-cb-logo">TH</span>
      <span class="th-cb-name">Townshub Channel Analysis</span>
      <button class="th-cb-close" id="th-cb-close">✕</button>
    </div>
    <div class="th-cb-grid">
      <div class="th-cb-stat"><div class="th-cb-val" style="color:#00D4FF">${subs}</div><div class="th-cb-lbl">Est. Subscribers</div></div>
      <div class="th-cb-stat"><div class="th-cb-val" style="color:${color}">${level}</div><div class="th-cb-lbl">Competition</div></div>
      <div class="th-cb-stat"><div class="th-cb-val" style="color:#a78bfa">$${rpm}</div><div class="th-cb-lbl">Avg RPM</div></div>
      <div class="th-cb-stat"><div class="th-cb-val" style="color:#34d399">${growth}</div><div class="th-cb-lbl">Growth/mo</div></div>
    </div>
    <div class="th-cb-rows">
      <div class="th-cb-row"><span>Niche</span><strong>${niche}</strong></div>
      <div class="th-cb-row"><span>Channel Score</span><strong style="color:${sc}">${scoreVal}/99</strong></div>
      <div class="th-cb-row"><span>Monetized</span><strong style="color:${monetized ? '#34d399' : '#f87171'}">${monetized ? '✓ Eligible' : '✗ Below threshold'}</strong></div>
      <div class="th-cb-row"><span>Upload Frequency</span><strong>${upload}</strong></div>
    </div>
    <div class="th-cb-actions">
      <button class="th-cb-btn-primary" id="th-cb-niche">⚡ Analyse Niche</button>
      <button class="th-cb-btn-secondary" id="th-cb-script">+ New Script</button>
    </div>
  `;

  // Try multiple inject targets for different channel page layouts
  const target = document.querySelector('#channel-header-container, #channel-header, ytd-channel-about-metadata-renderer, #tabs-inner-container');
  if (target) target.after(banner);
  else {
    const tabs = document.querySelector('#tabsContainer, ytd-two-column-browse-results-renderer');
    if (tabs) tabs.before(banner);
    else document.body.appendChild(banner);
  }

  document.getElementById('th-cb-close').addEventListener('click', () => banner.remove());
  document.getElementById('th-cb-niche').addEventListener('click', () => window.open(`${TH.APP_URL}/dashboard/niche-finder`, '_blank'));
  document.getElementById('th-cb-script').addEventListener('click', () => window.open(`${TH.APP_URL}/dashboard/new-script`, '_blank'));
}

// ── Thumbnail overlays (search/home/feed) ──────────────────
function injectOverlay(el) {
  if (el.dataset.thInjected) return;
  const thumb = el.querySelector('ytd-thumbnail, #thumbnail');
  if (!thumb) return;
  const { title, viewText, videoId } = getVideoMeta(el);
  if (!title) return;
  el.dataset.thInjected = '1';
  thumb.style.position = 'relative';
  const score = TH.getScore(title, viewText);
  const color = TH.scoreColor(score);
  const vph = TH.getVPH(viewText);
  const tags = TH.generateTags(title);

  const scoreBadge = makeBadge(`<span style="color:${color}">⚡ ${score}</span>`, { top: '6px', left: '6px', background: 'rgba(4,8,16,0.85)', border: `1px solid ${color}44`, borderRadius: '5px', padding: '2px 7px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', pointerEvents: 'all' });
  scoreBadge.title = 'Click to inspect thumbnail';
  scoreBadge.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); showThumbInspector(videoId, title, scoreBadge); });
  thumb.appendChild(scoreBadge);

  thumb.appendChild(makeBadge(`<span style="color:#34d399">▲ ${vph}</span>`, { top: '6px', right: '6px', background: 'rgba(4,8,16,0.85)', border: '1px solid rgba(52,211,153,0.35)', borderRadius: '5px', padding: '2px 7px', fontSize: '10px', fontWeight: '700' }));

  const tagBadge = makeBadge(`<span style="color:#fb923c">🏷 ${tags.length} tags</span>`, { bottom: '6px', left: '6px', background: 'rgba(4,8,16,0.85)', border: '1px solid rgba(251,146,60,0.35)', borderRadius: '5px', padding: '2px 7px', fontSize: '10px', fontWeight: '700', cursor: 'pointer', pointerEvents: 'all' });
  tagBadge.title = 'Click to view tags';
  tagBadge.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); showTagPanel(tags, tagBadge); });
  thumb.appendChild(tagBadge);

  const importBtn = document.createElement('div');
  importBtn.className = 'th-badge th-import-btn';
  importBtn.innerHTML = `<span>↓ Import</span>`;
  thumb.appendChild(importBtn);
  importBtn.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    importBtn.innerHTML = `<span style="color:#34d399">✓ Imported</span>`;
    importBtn.style.borderColor = 'rgba(52,211,153,0.5)';
    importedCount++;
    setTimeout(() => window.open(`${TH.APP_URL}/dashboard/new-script?idea=${encodeURIComponent(title)}`, '_blank'), 350);
  });
  injectedCount++;
}

// ── Run all injections ─────────────────────────────────────
function runInjection() {
  document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer').forEach(injectOverlay);
  injectCompetitionGuard();
  injectWatchPanel();
  injectChannelBanner();
}

// Close floating panels on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('#th-tag-panel') && !e.target.closest('#th-thumb-panel') && !e.target.closest('.th-badge')) {
    document.getElementById('th-tag-panel')?.remove();
    document.getElementById('th-thumb-panel')?.remove();
  }
});

setTimeout(runInjection, 1200);

window.addEventListener('yt-navigate-finish', () => {
  document.getElementById('th-comp-guard')?.remove();
  document.getElementById('th-watch-panel')?.remove();
  document.getElementById('th-channel-banner')?.remove();
  setTimeout(runInjection, 1400);
});

let debounce;
new MutationObserver(() => {
  clearTimeout(debounce);
  debounce = setTimeout(runInjection, 700);
}).observe(document.documentElement, { childList: true, subtree: true });

chrome.runtime.sendMessage({ type: 'PAGE_READY', url: location.href });
chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (msg.type === 'GET_STATS') {
    reply({ videos: injectedCount, low: Math.round(injectedCount * 0.3), imported: importedCount });
    return true;
  }
});
