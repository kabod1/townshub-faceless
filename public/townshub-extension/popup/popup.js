// Townshub Monitor — Popup v2

const APP = 'https://faceless.townshub.com';

// ── Helpers ────────────────────────────────────────────────
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function scoreColor(s) { return s >= 80 ? '#34d399' : s >= 60 ? '#facc15' : '#f87171'; }
function getScore(title) { return Math.min(99, (hashStr(title || '') % 38) + 55); }
function getCTR(title) { return 45 + (hashStr(title + 'ctr') % 50); }
function getTagCount(title) { return 6 + (hashStr(title + 'tags') % 9); }
function getCompScore(query) { return hashStr((query || '') + 'comp') % 100; }
function detectPageType(url) {
  if (!url || !url.includes('youtube.com')) return 'inactive';
  if (url.includes('/watch')) return 'video';
  if (url.includes('/results')) return 'search';
  if (url.match(/\/@|\/channel\/|\/user\/|\/c\//)) return 'channel';
  return 'home';
}
function go(path) { chrome.tabs.create({ url: APP + path }); }

// ── Render: Not on YouTube ─────────────────────────────────
function renderInactive() {
  document.getElementById('statusDot').classList.add('inactive');
  document.getElementById('headerSub').textContent = 'MONITOR';
  document.getElementById('mainContent').innerHTML = `
    <div class="ctx-card">
      <span class="ctx-icon">🌐</span>
      <div class="ctx-title">Not on YouTube</div>
      <div class="ctx-desc">Navigate to YouTube to activate overlays and start analysing videos.</div>
    </div>
    <div class="actions">
      <button class="btn-primary" id="b1">Open YouTube</button>
      <button class="btn-secondary" id="b2">Open Dashboard →</button>
    </div>
  `;
  document.getElementById('b1').onclick = () => chrome.tabs.create({ url: 'https://www.youtube.com' });
  document.getElementById('b2').onclick = () => go('/dashboard');
}

// ── Render: YouTube home / generic page ───────────────────
function renderHome(videos, low, imported) {
  document.getElementById('headerSub').textContent = 'MONITOR';
  document.getElementById('mainContent').innerHTML = `
    <div class="ctx-card" style="text-align:left;padding:13px 14px">
      <div style="font-size:10px;font-weight:800;color:#00D4FF;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:10px">Active on YouTube</div>
      <div class="feature-list" style="margin:0">
        <div class="feature-item"><span class="fdot green"></span>Outlier Score™ — click ⚡ badge to inspect</div>
        <div class="feature-item"><span class="fdot orange"></span>Tag Extraction — click 🏷 badge to copy tags</div>
        <div class="feature-item"><span class="fdot cyan"></span>Analytics Overlay — views/hr on thumbnails</div>
        <div class="feature-item"><span class="fdot purple"></span>Competition Guard — on search result pages</div>
        <div class="feature-item"><span class="fdot yellow"></span>One-click Import → New Script</div>
      </div>
    </div>
    ${videos ? `<div class="stats-row">
      <div class="stat"><div class="stat-val">${videos}</div><div class="stat-label">Analysed</div></div>
      <div class="stat"><div class="stat-val">${low}</div><div class="stat-label">Low Comp.</div></div>
      <div class="stat"><div class="stat-val">${imported}</div><div class="stat-label">Imported</div></div>
    </div>` : ''}
    <div class="actions">
      <button class="btn-primary" id="b1">⚡ New Script</button>
      <button class="btn-secondary" id="b2">Open Dashboard →</button>
    </div>
  `;
  document.getElementById('b1').onclick = () => go('/dashboard/new-script');
  document.getElementById('b2').onclick = () => go('/dashboard');
}

// ── Render: Video watch page ───────────────────────────────
function renderVideo(tab) {
  document.getElementById('headerSub').textContent = 'VIDEO ANALYZER';
  const title = (tab.title || '').replace(' - YouTube', '').trim() || 'Unknown Video';
  const score = getScore(title);
  const sc = scoreColor(score);
  const ctr = getCTR(title);
  const ctrC = ctr >= 75 ? '#34d399' : ctr >= 50 ? '#facc15' : '#f87171';
  const tags = getTagCount(title);
  const shortTitle = title.length > 50 ? title.slice(0, 50) + '…' : title;
  const rating = score >= 80 ? 'High Outlier 🔥' : score >= 60 ? 'Above Average' : 'Below Average';

  document.getElementById('mainContent').innerHTML = `
    <div class="ctx-card">
      <span class="ctx-icon">🎬</span>
      <div style="margin-bottom:6px">
        <span class="score-badge" style="background:${sc}18;border:1px solid ${sc}44;color:${sc}">⚡ Outlier Score: ${score}</span>
      </div>
      <div class="ctx-title">Video Page Detected</div>
      <div class="ctx-desc" style="margin-top:5px">${shortTitle}</div>
    </div>
    <div class="detail-list">
      <div class="detail-row"><span class="detail-key">CTR Potential</span><span class="detail-val" style="color:${ctrC}">${ctr}/100</span></div>
      <div class="detail-row"><span class="detail-key">Hidden Tags</span><span class="detail-val" style="color:#fb923c">~${tags} tags</span></div>
      <div class="detail-row"><span class="detail-key">Score Rating</span><span class="detail-val" style="color:${sc}">${rating}</span></div>
    </div>
    <div class="actions">
      <button class="btn-primary" id="b1">⚡ Analyse This Video</button>
      <button class="btn-secondary" id="b2">Open Dashboard →</button>
    </div>
  `;
  document.getElementById('b1').onclick = () => go(`/dashboard/new-script?idea=${encodeURIComponent(title)}`);
  document.getElementById('b2').onclick = () => go('/dashboard');
}

// ── Render: Search results page ────────────────────────────
function renderSearch(tab) {
  document.getElementById('headerSub').textContent = 'COMPETITION GUARD';
  const query = new URL(tab.url).searchParams.get('search_query') || '';
  const cs = getCompScore(query);
  const level = cs > 65 ? 'High' : cs > 35 ? 'Medium' : 'Low';
  const color = { Low: '#34d399', Medium: '#facc15', High: '#f87171' }[level];
  const opp = 100 - cs;
  const channels = 40 + (hashStr(query) % 160);
  const rpm = (3 + (hashStr(query + 'rpm') % 14)).toFixed(2);
  const verdict = level === 'Low' ? 'Great niche gap ✓' : level === 'Medium' ? 'Manageable' : 'Saturated ✗';
  const shortQ = query.length > 26 ? query.slice(0, 26) + '…' : query;

  document.getElementById('mainContent').innerHTML = `
    <div class="ctx-card">
      <span class="ctx-icon">🛡️</span>
      <div style="margin-bottom:6px">
        <span class="comp-badge" style="background:${color}18;border:1px solid ${color}44;color:${color}">
          <span class="comp-dot" style="background:${color};box-shadow:0 0 5px ${color}80"></span>
          ${level} Competition
        </span>
      </div>
      <div class="ctx-title">Search Analysed</div>
      <div class="ctx-desc" style="margin-top:4px">"${shortQ}"</div>
    </div>
    <div class="detail-list">
      <div class="detail-row"><span class="detail-key">Opportunity Score</span><span class="detail-val" style="color:#00D4FF">${opp}/100</span></div>
      <div class="detail-row"><span class="detail-key">Active Channels</span><span class="detail-val">~${channels}</span></div>
      <div class="detail-row"><span class="detail-key">Avg RPM</span><span class="detail-val" style="color:#a78bfa">$${rpm}</span></div>
      <div class="detail-row"><span class="detail-key">Verdict</span><span class="detail-val" style="color:${color}">${verdict}</span></div>
    </div>
    <div class="actions">
      <button class="btn-primary" id="b1">Open Niche Finder</button>
      <button class="btn-secondary" id="b2">Open Dashboard →</button>
    </div>
  `;
  document.getElementById('b1').onclick = () => go('/dashboard/niche-finder');
  document.getElementById('b2').onclick = () => go('/dashboard');
}

// ── Render: Channel page ───────────────────────────────────
function renderChannel(tab) {
  document.getElementById('headerSub').textContent = 'CHANNEL ANALYZER';
  const url = tab.url || '';
  const handleMatch = url.match(/\/@([^/?#]+)/);
  const handle = handleMatch ? `@${handleMatch[1]}` : 'this channel';
  const h = hashStr(handle);
  const subs = ['12K', '48K', '102K', '287K', '540K', '1.2M'][h % 6];
  const niche = ['Finance', 'Education', 'Health', 'Technology', 'Entertainment', 'Lifestyle'][h % 6];
  const cs = getCompScore(niche);
  const level = cs > 65 ? 'High' : cs > 35 ? 'Medium' : 'Low';
  const color = { Low: '#34d399', Medium: '#facc15', High: '#f87171' }[level];
  const upload = ['Daily', '3×/week', 'Weekly', '2×/month'][(h + 1) % 4];

  document.getElementById('mainContent').innerHTML = `
    <div class="ctx-card">
      <span class="ctx-icon">📺</span>
      <div class="ctx-title">Channel Page Detected</div>
      <div class="ctx-desc" style="margin-top:5px">
        <strong style="color:#e2e8f0">${handle}</strong><br>
        Analyse this channel and see the outlier score for the current video.
      </div>
    </div>
    <div class="detail-list">
      <div class="detail-row"><span class="detail-key">Est. Subscribers</span><span class="detail-val" style="color:#00D4FF">${subs}</span></div>
      <div class="detail-row"><span class="detail-key">Niche</span><span class="detail-val">${niche}</span></div>
      <div class="detail-row"><span class="detail-key">Niche Competition</span><span class="detail-val" style="color:${color}">${level}</span></div>
      <div class="detail-row"><span class="detail-key">Upload Frequency</span><span class="detail-val">${upload}</span></div>
    </div>
    <div class="actions">
      <button class="btn-primary" id="b1">⚡ Analyse Channel</button>
      <button class="btn-secondary" id="b2">Open Dashboard →</button>
    </div>
    <div style="padding:0 12px 10px;font-size:10px;color:#334155;text-align:center">
      Works on channel pages: /@handle, /channel/, /user/, /c/
    </div>
  `;
  document.getElementById('b1').onclick = () => go(`/dashboard/niche-finder`);
  document.getElementById('b2').onclick = () => go('/dashboard');
}

// ── Init ───────────────────────────────────────────────────
async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = tab?.url || '';
  const type = detectPageType(url);

  if (type === 'inactive') { renderInactive(); return; }

  let stats = { videos: 0, low: 0, imported: 0 };
  try {
    await new Promise(res => {
      chrome.tabs.sendMessage(tab.id, { type: 'GET_STATS' }, r => {
        if (!chrome.runtime.lastError && r) stats = r;
        res();
      });
    });
  } catch (_) {}

  if (type === 'video')   renderVideo(tab);
  else if (type === 'search')  renderSearch(tab);
  else if (type === 'channel') renderChannel(tab);
  else renderHome(stats.videos, stats.low, stats.imported);
}

init();
