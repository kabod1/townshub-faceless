// Townshub — Popup Script

const DASHBOARD_URL = "https://townshub-faceless.vercel.app/dashboard";

const btnAnalyze   = document.getElementById("btn-analyze");
const btnDashboard = document.getElementById("btn-dashboard");
const statusTitle  = document.getElementById("status-title");
const statusDesc   = document.getElementById("status-desc");
const statusIcon   = document.getElementById("status-icon");

btnDashboard.href = DASHBOARD_URL;

function isChannelUrl(url) {
  if (!url) return false;
  return (
    url.includes("youtube.com/@") ||
    url.includes("youtube.com/channel/") ||
    url.includes("youtube.com/user/") ||
    url.includes("youtube.com/c/")
  );
}

// Check current tab
chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab) return;

  if (isChannelUrl(tab.url)) {
    statusIcon.textContent  = "✅";
    statusTitle.textContent = "Channel Detected";
    statusDesc.textContent  = `Click below to open the analysis panel for this channel.`;
    btnAnalyze.textContent  = "⚡ Open Analysis Panel";
  } else if (tab.url?.includes("youtube.com")) {
    statusIcon.textContent  = "📺";
    statusTitle.textContent = "Go to a Channel";
    statusDesc.textContent  = "You're on YouTube but not on a channel page. Navigate to any channel to start analyzing.";
    btnAnalyze.disabled = true;
    btnAnalyze.style.opacity = "0.4";
    btnAnalyze.style.cursor = "not-allowed";
  } else {
    statusIcon.textContent  = "📺";
    statusTitle.textContent = "Open YouTube";
    statusDesc.textContent  = "Navigate to a YouTube channel page and the ⚡ button will appear automatically.";
    btnAnalyze.disabled = true;
    btnAnalyze.style.opacity = "0.4";
    btnAnalyze.style.cursor = "not-allowed";
  }
});

// Trigger panel in content script
btnAnalyze.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab || !isChannelUrl(tab.url)) return;
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
