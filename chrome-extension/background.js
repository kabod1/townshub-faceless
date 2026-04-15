// Townshub — Background Service Worker (Manifest V3)

chrome.runtime.onInstalled.addListener(() => {
  console.log("Townshub Channel Analyzer installed.");
});

// Open dashboard when extension icon clicked (if no popup is defined for this tab)
chrome.action.onClicked.addListener((tab) => {
  if (tab.url && (tab.url.includes("youtube.com/@") || tab.url.includes("youtube.com/channel"))) {
    // Let popup handle it
    return;
  }
  chrome.tabs.create({ url: "https://townshub-faceless.vercel.app/dashboard" });
});
