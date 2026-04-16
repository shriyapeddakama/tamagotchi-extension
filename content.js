// BuddyTime Content Script
// Notifies background about current page

chrome.runtime.sendMessage({
  type: 'PAGE_VISIT',
  url: window.location.href,
  title: document.title
}).catch(() => {});
