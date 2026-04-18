// Townshub Monitor — Service Worker (Background)

let currentTabInfo = {};

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === 'PAGE_READY') {
    currentTabInfo[sender.tab?.id] = { url: msg.url, ts: Date.now() };
  }
});

// Open Townshub when extension icon clicked (fallback if popup fails)
chrome.action.onClicked.addListener((tab) => {
  if (tab.url?.includes('youtube.com')) return; // popup handles it
  chrome.tabs.create({ url: 'https://faceless.townshub.com/dashboard' });
});
