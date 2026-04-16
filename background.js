// BuddyTime Background Service Worker

const SOCIAL_MEDIA_DOMAINS = [
  'twitter.com', 'x.com', 'facebook.com', 'instagram.com',
  'tiktok.com', 'reddit.com', 'youtube.com', 'snapchat.com',
  'pinterest.com', 'tumblr.com', 'linkedin.com', 'twitch.tv'
];

let sessionStart = Date.now();
let totalOnlineTime = 0;
let productiveTime = 0;
let socialTime = 0;
let isWorkMode = false;
let currentSocialStart = null;
let tickInterval = null;

// Initialize storage on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    animal: 'cat',
    personality: 'motivational',
    sessionStart: Date.now(),
    totalOnlineTime: 0,
    productiveTime: 0,
    socialTime: 0,
    isWorkMode: false,
    socialLimit: 30, // minutes
    tasks: [],
    dailyStats: {}
  });
});

// Track time every second
chrome.alarms.create('tick', { periodInMinutes: 1/60 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'tick') {
    updateTime();
  }
});

async function updateTime() {
  const data = await chrome.storage.local.get([
    'isWorkMode', 'socialTime', 'totalOnlineTime', 'productiveTime',
    'currentTab', 'socialLimit', 'sessionStart'
  ]);

  const increment = 1; // 1 second
  let updates = {
    totalOnlineTime: (data.totalOnlineTime || 0) + increment
  };

  if (data.isWorkMode) {
    updates.productiveTime = (data.productiveTime || 0) + increment;
  }

  const isSocial = data.currentTab && isSocialMediaDomain(data.currentTab);
  if (isSocial) {
    updates.socialTime = (data.socialTime || 0) + increment;
    
    // Check if over limit
    const socialMinutes = updates.socialTime / 60;
    const limit = data.socialLimit || 30;
    if (socialMinutes > limit && socialMinutes % 5 < 0.02) {
      // Notify every 5 minutes over limit
      chrome.runtime.sendMessage({ 
        type: 'SOCIAL_OVER_LIMIT', 
        minutes: Math.floor(socialMinutes),
        limit: limit 
      }).catch(() => {});
    }
  }

  chrome.storage.local.set(updates);
}

function isSocialMediaDomain(url) {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return SOCIAL_MEDIA_DOMAINS.some(d => domain.includes(d));
  } catch {
    return false;
  }
}

// Listen for tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    chrome.storage.local.set({ currentTab: tab.url });
    
    const isSocial = isSocialMediaDomain(tab.url);
    chrome.runtime.sendMessage({ 
      type: 'TAB_CHANGED', 
      url: tab.url, 
      isSocial 
    }).catch(() => {});
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id === tabId) {
        chrome.storage.local.set({ currentTab: changeInfo.url });
      }
    });
  }
});

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SET_WORK_MODE') {
    chrome.storage.local.set({ isWorkMode: message.value });
    sendResponse({ success: true });
  }
  if (message.type === 'RESET_SOCIAL') {
    chrome.storage.local.set({ socialTime: 0 });
    sendResponse({ success: true });
  }
  if (message.type === 'GET_STATS') {
    chrome.storage.local.get(null, (data) => sendResponse(data));
    return true;
  }
  return true;
});
