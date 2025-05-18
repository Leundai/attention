type Tweet = {
  id: string;
  content: string;
  timestamp: number;
};

const processedTweetIds = new Set();

let scrapingStarted = false;

function getTweetId(tweet: HTMLElement) {
  const anchor: HTMLLinkElement | null = tweet.querySelector('a[href*="/status/"]');
  if (!anchor) return null;
  const match = anchor.href.match(/status\/(\d+)/);
  return match ? match[1] : null;
}

function scrapeTimeline() {
  const tweets = document.querySelectorAll('article');
  const newTweets: Tweet[] = [];

  tweets.forEach(tweet => {
    const id = getTweetId(tweet);
    if (!id || processedTweetIds.has(id)) return;

    const textNode: HTMLElement | null = tweet.querySelector('div[lang]');
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
    console.log('New tweets scraped:', newTweets);
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

startScraping();

console.log('content script loaded');
