const processedTweetIds = new Set();

let scrapingStarted = false;

function getTweetId(tweet) {
  const anchor = tweet.querySelector('a[href*="/status/"]');
  if (!anchor) return null;
  const match = anchor.href.match(/status\/(\d+)/);
  return match ? match[1] : null;
}

function scrapeTimeline() {
  const tweets = document.querySelectorAll("article");
  const newTweets = [];

  tweets.forEach((tweet) => {
    const id = getTweetId(tweet);
    if (!id || processedTweetIds.has(id)) return;

    const textNode = tweet.querySelector("div[lang]");
    if (textNode) {
      processedTweetIds.add(id);
      newTweets.push({
        id,
        content: textNode.innerText,
        timestamp: Date.now(),
      });
    }
  });

  if (newTweets.length) {
    console.log("New tweets scraped:", newTweets);
    console.log(chrome.storage);
    chrome.storage.local.get({ tweets: [] }, (result) => {
      const updated = result.tweets.concat(newTweets);
      chrome.storage.local.set({ tweets: updated });
    });
  }
}

function startScraping() {
  if (scrapingStarted) {
    return;
  }
  scrapingStarted = true;
  scrapeTimeline();
  const observer = new MutationObserver(scrapeTimeline);
  observer.observe(document.body, { childList: true, subtree: true });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "start_scraping") {
    startScraping();
    sendResponse({ status: "started" });
  }
});
