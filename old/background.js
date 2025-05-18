chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "scrape_tweets") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab?.id) {
        chrome.scripting.executeScript({
          target: { tabId: currentTab.id },
          files: ["content.js"], // or use `func:` to inject inline code
        });
      }
    });
  }
});
