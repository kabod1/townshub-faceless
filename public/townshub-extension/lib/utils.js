// Townshub Monitor — Shared utilities v2

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

  // CTR score for thumbnail inspector
  getCTRScore(title) {
    const h = TH.hashString(title + 'ctr');
    return 45 + (h % 50);
  },

  // Competition score for search query (0-100, higher = more competitive)
  getCompetitionScore(query) {
    return TH.hashString((query || '') + 'comp') % 100;
  },

  // Generate realistic tags from video title
  generateTags(title) {
    const stop = new Set(['the','a','an','is','in','of','to','and','for','that','this','with',
      'how','why','what','are','was','were','have','has','will','would','could','do','did',
      'does','i','you','we','they','he','she','it','my','your','our','its','be','by','at',
      'on','as','from','but','or','not','im','its','get','make','need','want']);
    const words = title.toLowerCase().split(/\W+/).filter(w => w.length > 2 && !stop.has(w));
    const tags = new Set();
    words.forEach(w => tags.add(w));
    words.slice(0, 3).forEach(w => {
      tags.add(`best ${w}`);
      tags.add(`${w} tips`);
      tags.add(`${w} guide`);
    });
    if (words.length >= 2) {
      tags.add(words.slice(0, 2).join(' '));
      tags.add(words[0] + ' ' + words[words.length - 1]);
    }
    tags.add('how to');
    tags.add('tutorial');
    tags.add('2025');
    tags.add('beginners guide');
    return [...tags].filter(Boolean).slice(0, 14);
  },
};

window.__TH = TH;
