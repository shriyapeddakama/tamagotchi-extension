// BuddyTime Background Service Worker

const SOCIAL_MEDIA_DOMAINS = [
  'twitter.com', 'x.com', 'facebook.com', 'instagram.com',
  'tiktok.com', 'reddit.com', 'youtube.com', 'snapchat.com',
  'pinterest.com', 'tumblr.com', 'linkedin.com', 'twitch.tv'
];

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    animal: 'cat',
    personality: 'motivational',
    totalOnlineTime: 0,
    productiveTime: 0,
    socialTime: 0,
    isWorkMode: false,
    socialLimit: 30,
    tasks: [],
    siteTime: {},
    dailyStats: {},
    lastActiveDate: todayKey()
  });
});

chrome.runtime.onStartup.addListener(() => {
  checkDailyReset();
});

chrome.alarms.create('tick', { periodInMinutes: 1/60 });
chrome.alarms.create('dailyCheck', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'tick') updateTime();
  if (alarm.name === 'dailyCheck') checkDailyReset();
});

function checkDailyReset() {
  chrome.storage.local.get(
    ['lastActiveDate', 'totalOnlineTime', 'productiveTime', 'socialTime', 'siteTime', 'dailyStats'],
    function(data) {
      const today = todayKey();
      const last  = data.lastActiveDate;

      // Nothing to do if same day or no date stored yet
      if (!last || last === today) {
        if (!last) chrome.storage.local.set({ lastActiveDate: today });
        return;
      }

      // Archive yesterday then reset
      const history = data.dailyStats || {};
      history[last] = {
        totalOnlineTime: data.totalOnlineTime || 0,
        productiveTime:  data.productiveTime  || 0,
        socialTime:      data.socialTime      || 0,
        siteTime:        data.siteTime        || {}
      };

      // Keep only last 30 days
      const keys = Object.keys(history).sort();
      while (keys.length > 30) {
        delete history[keys.shift()];
      }

      chrome.storage.local.set({
        totalOnlineTime: 0,
        productiveTime:  0,
        socialTime:      0,
        siteTime:        {},
        isWorkMode:      false,
        lastActiveDate:  today,
        dailyStats:      history
      });
    }
  );
}

async function updateTime() {
  const data = await chrome.storage.local.get([
    'isWorkMode', 'socialTime', 'totalOnlineTime', 'productiveTime',
    'currentTab', 'socialLimit', 'siteTime'
  ]);

  const updates = {
    totalOnlineTime: (data.totalOnlineTime || 0) + 1
  };

  if (data.isWorkMode) {
    updates.productiveTime = (data.productiveTime || 0) + 1;
  }

  const isSocial = data.currentTab && isSocialMediaDomain(data.currentTab);
  if (isSocial) {
    updates.socialTime = (data.socialTime || 0) + 1;
    const socialMinutes = updates.socialTime / 60;
    const limit = data.socialLimit || 30;
    if (socialMinutes > limit && socialMinutes % 5 < 0.02) {
      chrome.runtime.sendMessage({ type: 'SOCIAL_OVER_LIMIT' }).catch(() => {});
    }
  }

  if (data.currentTab) {
    try {
      const host = new URL(data.currentTab).hostname.replace('www.', '');
      if (host && !host.startsWith('chrome')) {
        const siteTime = data.siteTime || {};
        siteTime[host] = (siteTime[host] || 0) + 1;
        updates.siteTime = siteTime;
      }
    } catch {}
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

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    chrome.storage.local.set({ currentTab: tab.url });
    chrome.runtime.sendMessage({
      type: 'TAB_CHANGED',
      url: tab.url,
      isSocial: isSocialMediaDomain(tab.url)
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_STATS') {
    chrome.storage.local.get(null, (data) => sendResponse(data));
    return true;
  }
  sendResponse({ success: true });
  return true;
});
