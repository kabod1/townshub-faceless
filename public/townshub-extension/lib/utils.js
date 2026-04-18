// Townshub Monitor — Shared utilities

const TH = {
  APP_URL: 'https://faceless.townshub.com',

  hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  },

  getScore(title, viewText) {
    const views = TH.parseViews(viewText);
    const h = TH.hashString(title || '');
    const base = (h % 38) + 55;
    const boost = views > 1_000_000 ? 12 : views > 500_000 ? 8 : views > 100_000 ? 4 : 0;
    return Math.min(99, base + boost);
  },

  parseViews(text) {
    if (!text) return 0;
    const m = text.match(/([\d,.]+)\s*([KMB])?/i);
    if (!m) return 0;
    const n = parseFloat(m[1].replace(/,/g, ''));
    const suffix = (m[2] || '').toUpperCase();
    return suffix === 'B' ? n * 1e9 : suffix === 'M' ? n * 1e6 : suffix === 'K' ? n * 1e3 : n;
  },

  getVPH(viewText) {
    const v = TH.parseViews(viewText);
    if (v <= 0) return '—';
    const vph = v / 2400;
    return vph >= 1000 ? `${(vph / 1000).toFixed(1)}k/hr` : `${Math.round(vph)}/hr`;
  },

  scoreColor(score) {
    if (score >= 80) return '#34d399';
    if (score >= 60) return '#facc15';
    return '#f87171';
  },

  getTags(count) {
    const n = count || Math.floor(Math.random() * 12) + 4;
    return n;
  },
};

window.__TH = TH;
