// Townshub Monitor — Content Script
// Injected into all YouTube pages

const TH = window.__TH;
let injectedCount = 0;

function getVideoMeta(el) {
  const title =
    el.querySelector('#video-title, #video-title-link')?.textContent?.trim() ||
    el.querySelector('h3 a')?.textContent?.trim() || '';
  const viewText =
    el.querySelector('.ytd-video-meta-block, #metadata-line span')?.textContent || '';
  const channel =
    el.querySelector('#channel-name a, .ytd-channel-name a')?.textContent?.trim() || '';
  return { title, viewText, channel };
}

function createBadge(html, styles) {
  const el = document.createElement('div');
  el.className = 'th-badge';
  el.innerHTML = html;
  Object.assign(el.style, {
    position: 'absolute',
    zIndex: '9999',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    pointerEvents: 'none',
    backdropFilter: 'blur(6px)',
    lineHeight: '1.3',
    ...styles,
  });
  return el;
}

function injectOverlay(el) {
  if (el.dataset.thInjected) return;
  const thumb = el.querySelector('ytd-thumbnail, #thumbnail');
  if (!thumb) return;
  const { title, viewText } = getVideoMeta(el);
  if (!title) return;

  el.dataset.thInjected = '1';
  thumb.style.position = 'relative';

  const score = TH.getScore(title, viewText);
  const color = TH.scoreColor(score);
  const vph = TH.getVPH(viewText);
  const tags = TH.getTags(TH.hashString(title) % 14 + 4);

  // ── Outlier score badge (top-left) ─────────────────────────────
  thumb.appendChild(createBadge(
    `<span style="color:${color}">⚡ ${score}</span>`,
    {
      top: '6px', left: '6px',
      background: 'rgba(4,8,16,0.85)',
      border: `1px solid ${color}44`,
      borderRadius: '5px',
      padding: '2px 7px',
      fontSize: '11px',
      fontWeight: '800',
    }
  ));

  // ── VPH badge (top-right) ──────────────────────────────────────
  thumb.appendChild(createBadge(
    `<span style="color:#34d399">▲ ${vph}</span>`,
    {
      top: '6px', right: '6px',
      background: 'rgba(4,8,16,0.85)',
      border: '1px solid rgba(52,211,153,0.35)',
      borderRadius: '5px',
      padding: '2px 7px',
      fontSize: '10px',
      fontWeight: '700',
    }
  ));

  // ── Tag count badge (bottom-left) ─────────────────────────────
  thumb.appendChild(createBadge(
    `<span style="color:#fb923c">🏷 ${tags} tags</span>`,
    {
      bottom: '6px', left: '6px',
      background: 'rgba(4,8,16,0.85)',
      border: '1px solid rgba(251,146,60,0.35)',
      borderRadius: '5px',
      padding: '2px 7px',
      fontSize: '10px',
      fontWeight: '700',
    }
  ));

  // ── Import button (bottom-right, interactive) ──────────────────
  const importBtn = document.createElement('div');
  importBtn.className = 'th-badge th-import';
  importBtn.innerHTML = `<span style="color:#00D4FF;font-weight:800;font-size:10px;font-family:-apple-system,sans-serif;">↓ Townshub</span>`;
  Object.assign(importBtn.style, {
    position: 'absolute',
    bottom: '6px', right: '6px',
    zIndex: '9999',
    background: 'rgba(4,8,16,0.88)',
    border: '1px solid rgba(0,212,255,0.4)',
    borderRadius: '5px',
    padding: '3px 9px',
    cursor: 'pointer',
    backdropFilter: 'blur(6px)',
    transition: 'all 0.15s',
  });

  importBtn.addEventListener('mouseenter', () => {
    importBtn.style.background = 'rgba(0,212,255,0.15)';
    importBtn.style.borderColor = 'rgba(0,212,255,0.7)';
  });
  importBtn.addEventListener('mouseleave', () => {
    importBtn.style.background = 'rgba(4,8,16,0.88)';
    importBtn.style.borderColor = 'rgba(0,212,255,0.4)';
  });
  importBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    importBtn.innerHTML = `<span style="color:#34d399;font-weight:800;font-size:10px;font-family:-apple-system,sans-serif;">✓ Imported</span>`;
    importBtn.style.borderColor = 'rgba(52,211,153,0.5)';
    setTimeout(() => {
      window.open(`${TH.APP_URL}/dashboard/new-script?idea=${encodeURIComponent(title)}`, '_blank');
    }, 350);
  });

  thumb.appendChild(importBtn);
  injectedCount++;
}

function runInjection() {
  document.querySelectorAll(
    'ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer'
  ).forEach(injectOverlay);
}

// Initial run
setTimeout(runInjection, 1000);

// SPA navigation (YouTube fires this on every page change)
window.addEventListener('yt-navigate-finish', () => setTimeout(runInjection, 1200));

// MutationObserver for dynamically loaded content
let debounce;
new MutationObserver(() => {
  clearTimeout(debounce);
  debounce = setTimeout(runInjection, 600);
}).observe(document.documentElement, { childList: true, subtree: true });

// Notify background script
chrome.runtime.sendMessage({ type: 'PAGE_READY', url: location.href });
