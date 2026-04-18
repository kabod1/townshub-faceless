// Townshub Monitor — Popup Script

const APP_URL = 'https://faceless.townshub.com';

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isYouTube = tab?.url?.includes('youtube.com');
  const dot = document.getElementById('statusDot');
  const pageStatus = document.getElementById('pageStatus');
  const statsEl = document.getElementById('stats');

  if (isYouTube) {
    dot.classList.remove('inactive');
    pageStatus.textContent = '✓ Active on YouTube';
    pageStatus.className = 'active';
    statsEl.style.display = 'grid';

    // Ask content script for video count
    try {
      chrome.tabs.sendMessage(tab.id, { type: 'GET_STATS' }, (res) => {
        if (chrome.runtime.lastError) return;
        if (res) {
          document.getElementById('statVideos').textContent = res.videos ?? '—';
          document.getElementById('statLow').textContent = res.low ?? '—';
          document.getElementById('statImported').textContent = res.imported ?? '0';
        }
      });
    } catch (_) {}
  } else {
    dot.classList.add('inactive');
    pageStatus.textContent = '○ Navigate to YouTube to activate';
    pageStatus.className = 'inactive';
  }
}

document.getElementById('btnDashboard').addEventListener('click', () => {
  chrome.tabs.create({ url: `${APP_URL}/dashboard` });
});

document.getElementById('btnNewScript').addEventListener('click', () => {
  chrome.tabs.create({ url: `${APP_URL}/dashboard/new-script` });
});

init();
