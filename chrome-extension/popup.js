// Townshub — Popup Script

const DASHBOARD_URL = "https://townshub-faceless.vercel.app/dashboard";

const btnAnalyze   = document.getElementById("btn-analyze");
const btnDashboard = document.getElementById("btn-dashboard");
const statusTitle  = document.getElementById("status-title");
const statusDesc   = document.getElementById("status-desc");
const statusIcon   = document.getElementById("status-icon");

btnDashboard.href = DASHBOARD_URL;

function isAnalyzableUrl(url) {
  if (!url) return false;
  return (
    url.includes("youtube.com/@") ||
    url.includes("youtube.com/channel/") ||
    url.includes("youtube.com/user/") ||
    url.includes("youtube.com/c/") ||
    url.includes("youtube.com/watch")   // ← video pages now supported
  );
}

function isVideoUrl(url) {
  return url?.includes("youtube.com/watch");
}

// Check current tab
chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab) return;

  if (isVideoUrl(tab.url)) {
    statusIcon.textContent  = "🎬";
    statusTitle.textContent = "Video Page Detected";
    statusDesc.textContent  = "Analyze this channel and see the outlier score for the current video.";
    btnAnalyze.textContent  = "⚡ Analyze This Video";
  } else if (isAnalyzableUrl(tab.url)) {
    statusIcon.textContent  = "✅";
    statusTitle.textContent = "Channel Detected";
    statusDesc.textContent  = "Click below to open the analysis panel for this channel.";
    btnAnalyze.textContent  = "⚡ Open Analysis Panel";
  } else if (tab.url?.includes("youtube.com")) {
    statusIcon.textContent  = "📺";
    statusTitle.textContent = "Go to a Channel or Video";
    statusDesc.textContent  = "Navigate to any YouTube channel page or video to start analyzing.";
    btnAnalyze.disabled = true;
    btnAnalyze.style.opacity = "0.4";
    btnAnalyze.style.cursor  = "not-allowed";
  } else {
    statusIcon.textContent  = "📺";
    statusTitle.textContent = "Open YouTube";
    statusDesc.textContent  = "Open any YouTube video or channel — the ⚡ button appears automatically.";
    btnAnalyze.disabled = true;
    btnAnalyze.style.opacity = "0.4";
    btnAnalyze.style.cursor  = "not-allowed";
  }
});

// Trigger panel in content script
btnAnalyze.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab || !isAnalyzableUrl(tab.url)) return;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const trigger = document.getElementById("th-trigger");
        const panel   = document.getElementById("th-panel");
        if (panel) {
          panel.classList.remove("th-hidden");
          trigger?.classList.add("th-panel-open");
        } else if (trigger) {
          trigger.click();
        }
      },
    });
    window.close();
  });
});
