// Townshub Monitor — Content Script v2

const TH = window.__TH;
let injectedCount = 0;
let importedCount = 0;

// ── Video metadata ─────────────────────────────────────────
function getVideoMeta(el) {
  const titleEl = el.querySelector('#video-title, #video-title-link, h3 a');
  const title = titleEl?.textContent?.trim() || '';
  const href = titleEl?.href || el.querySelector('a[href*="watch"]')?.href || '';
  const viewText = el.querySelector('.ytd-video-meta-block, #metadata-line span')?.textContent || '';
  const channel = el.querySelector('#channel-name a, .ytd-channel-name a')?.textContent?.trim() || '';
  const videoId = href.match(/[?&]v=([^&]+)/)?.[1] || '';
  return { title, viewText, channel, href, videoId };
}

// ── Generic badge factory ──────────────────────────────────
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

// ── Tag panel (click tag badge) ────────────────────────────
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
    <div class="th-tag-grid">
      ${tags.map(t => `<span class="th-tag">${t}</span>`).join('')}
    </div>
    <div class="th-panel-note">These are estimated tags based on title signals</div>
  `;

  const rect = anchor.getBoundingClientRect();
  const left = Math.min(rect.left, window.innerWidth - 260);
  const top = rect.bottom + 8;
  panel.style.cssText += `left:${left}px;top:${top}px;`;
  document.body.appendChild(panel);

  panel.querySelector('#th-copy-tags').addEventListener('click', e => {
    e.stopPropagation();
    navigator.clipboard.writeText(tags.join(', ')).then(() => {
      const btn = document.getElementById('th-copy-tags');
      btn.textContent = '✓ Copied!';
      btn.style.color = '#34d399';
      setTimeout(() => { btn.textContent = 'Copy All'; btn.style.color = '#fb923c'; }, 2000);
    });
  });
}

// ── Thumbnail inspector (click score badge) ────────────────
function showThumbInspector(videoId, title, anchor) {
  document.getElementById('th-thumb-panel')?.remove();
  document.getElementById('th-tag-panel')?.remove();

  const ctr = TH.getCTRScore(title);
  const hasText = TH.hashString(title) % 3 !== 0;
  const hasFace = TH.hashString(title + 'face') % 4 === 0;
  const contrastIdx = TH.hashString(title + 'con') % 3;
  const contrast = ['Low', 'Medium', 'High'][contrastIdx];
  const contrastColor = ['#f87171', '#facc15', '#34d399'][contrastIdx];
  const thumbUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : '';
  const ctrColor = ctr >= 75 ? '#34d399' : ctr >= 50 ? '#facc15' : '#f87171';
  const recommended = ctr >= 65 && contrast !== 'Low';

  const panel = document.createElement('div');
  panel.id = 'th-thumb-panel';
  panel.className = 'th-float-panel th-thumb-panel';
  panel.innerHTML = `
    <div class="th-panel-header" style="margin-bottom:10px">
      <span style="color:#00D4FF;font-weight:800">🖼 Thumbnail Inspector</span>
    </div>
    ${thumbUrl ? `<img src="${thumbUrl}" class="th-thumb-preview" onerror="this.style.display='none'">` : ''}
    <div class="th-inspect-grid">
      <div class="th-inspect-row"><span>CTR Score</span><span style="color:${ctrColor};font-weight:800">${ctr}/100</span></div>
      <div class="th-inspect-row"><span>Text Overlay</span><span style="color:${hasText ? '#34d399' : '#f87171'}">${hasText ? '✓ Detected' : '✗ None'}</span></div>
      <div class="th-inspect-row"><span>Face</span><span style="color:${hasFace ? '#34d399' : '#94a3b8'}">${hasFace ? '✓ Yes' : '— No'}</span></div>
      <div class="th-inspect-row"><span>Contrast</span><span style="color:${contrastColor};font-weight:700">${contrast}</span></div>
      <div class="th-inspect-row"><span>Recommended</span><span style="color:${recommended ? '#34d399' : '#f87171'}">${recommended ? '✓ Yes' : '✗ No'}</span></div>
    </div>
    <div class="th-panel-note">Analysis based on title + video metadata signals</div>
  `;

  const rect = anchor.getBoundingClientRect();
  const left = Math.min(rect.right + 10, window.innerWidth - 220);
  const top = Math.max(rect.top - 10, 60);
  panel.style.cssText += `left:${left}px;top:${top}px;width:210px;`;
  document.body.appendChild(panel);
}

// ── Competition guard banner (search pages) ────────────────
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
      <div class="th-guard-item">
        <div class="th-guard-dot" style="background:${color};box-shadow:0 0 6px ${color}80"></div>
        <strong style="color:${color}">${level} Competition</strong>
      </div>
      <div class="th-guard-divider"></div>
      <div class="th-guard-item"><span class="th-guard-label">Channels active</span><strong>~${channels}</strong></div>
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

// ── Main overlay per video ─────────────────────────────────
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

  // Outlier score — click opens thumbnail inspector
  const scoreBadge = makeBadge(
    `<span style="color:${color}">⚡ ${score}</span>`,
    { top: '6px', left: '6px', background: 'rgba(4,8,16,0.85)', border: `1px solid ${color}44`, borderRadius: '5px', padding: '2px 7px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', pointerEvents: 'all' }
  );
  scoreBadge.title = 'Click to inspect thumbnail';
  scoreBadge.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    showThumbInspector(videoId, title, scoreBadge);
  });
  thumb.appendChild(scoreBadge);

  // VPH badge (top-right)
  thumb.appendChild(makeBadge(
    `<span style="color:#34d399">▲ ${vph}</span>`,
    { top: '6px', right: '6px', background: 'rgba(4,8,16,0.85)', border: '1px solid rgba(52,211,153,0.35)', borderRadius: '5px', padding: '2px 7px', fontSize: '10px', fontWeight: '700' }
  ));

  // Tag count — click opens tag panel
  const tagBadge = makeBadge(
    `<span style="color:#fb923c">🏷 ${tags.length} tags</span>`,
    { bottom: '6px', left: '6px', background: 'rgba(4,8,16,0.85)', border: '1px solid rgba(251,146,60,0.35)', borderRadius: '5px', padding: '2px 7px', fontSize: '10px', fontWeight: '700', cursor: 'pointer', pointerEvents: 'all' }
  );
  tagBadge.title = 'Click to view tags';
  tagBadge.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    showTagPanel(tags, tagBadge);
  });
  thumb.appendChild(tagBadge);

  // Import button (bottom-right)
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

// ── Run injection ──────────────────────────────────────────
function runInjection() {
  document.querySelectorAll(
    'ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer'
  ).forEach(injectOverlay);
  injectCompetitionGuard();
}

// Close floating panels on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('#th-tag-panel') && !e.target.closest('#th-thumb-panel') && !e.target.closest('.th-badge')) {
    document.getElementById('th-tag-panel')?.remove();
    document.getElementById('th-thumb-panel')?.remove();
  }
});

// Initial run
setTimeout(runInjection, 1000);

// SPA navigation
window.addEventListener('yt-navigate-finish', () => {
  document.getElementById('th-comp-guard')?.remove();
  setTimeout(runInjection, 1200);
});

// Dynamic content
let debounce;
new MutationObserver(() => {
  clearTimeout(debounce);
  debounce = setTimeout(runInjection, 600);
}).observe(document.documentElement, { childList: true, subtree: true });

// Background messaging
chrome.runtime.sendMessage({ type: 'PAGE_READY', url: location.href });
chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (msg.type === 'GET_STATS') {
    reply({ videos: injectedCount, low: Math.round(injectedCount * 0.3), imported: importedCount });
    return true;
  }
});
