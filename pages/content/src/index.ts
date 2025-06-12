// type Tweet = {
//   id: string;
//   mainText: string;
//   retweetText?: string;
//   timestamp: number;
// };

// Inject external script file instead of inline script
function injectScript() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected.js');
  (document.head || document.documentElement).appendChild(script);
}

// Listen for messages from injected script
window.addEventListener('message', function (event) {
  if (event.source !== window) return;

  if (event.data.type === 'API_RESPONSE_INTERCEPTED') {
    console.log('Intercepted API response:', event.data);

    // Send to background script
    chrome.runtime.sendMessage({
      type: 'API_RESPONSE',
      data: event.data,
    });
  }
});

// Inject when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectScript);
} else {
  injectScript();
}

// Monkey Patching With TweetContent Response In-Line Script
// (function () {
//   const originalFetch = window.fetch;
//   console.log('originalFetch', originalFetch);

//   window.fetch = async function (...args) {
//     console.log('fetching');
//     const response = await originalFetch.apply(this, args);
//     const url = args[0];

//     if (
//       typeof url === 'string' &&
//       (url.includes('TweetDetail') || url.includes('ConversationTimeline') || url.includes('UserTweets'))
//     ) {
//       const cloned = response.clone();
//       cloned
//         .json()
//         .then(data => {
//           console.log('📥 Intercepted Twitter JSON:', data);

//           // Extract tweet(s) and detect replies
//           const tweet = extractTweet(data);
//           if (tweet && tweet.in_reply_to_status_id_str) {
//             console.log('🧵 This is a reply to:', tweet.in_reply_to_status_id_str);
//           }
//         })
//         .catch(err => console.error('❌ Failed to parse JSON', err));
//     }

//     return response;
//   };

//   function extractTweet(data) {
//     // Deep traversal example for TweetDetail endpoint
//     console.log('Extracting tweet');
//     try {
//       const instructions = data?.data?.threaded_conversation_with_injections?.instructions;
//       if (!instructions) return null;

//       for (const instruction of instructions) {
//         const entries = instruction.entries || [];
//         for (const entry of entries) {
//           const item = entry?.content?.itemContent?.tweet_results?.result;
//           if (item?.legacy) {
//             return item.legacy;
//           }
//         }
//       }
//     } catch (e) {
//       console.error('❌ Error extracting tweet:', e);
//     }
//     return null;
//   }
// })();

// This is doing DOM Scraping

// const processedTweetIds = new Set();

// let scrapingStarted = false;

// function getTweetId(tweet: HTMLElement) {
//   const anchor: HTMLLinkElement | null = tweet.querySelector('a[href*="/status/"]');
//   if (!anchor) return null;
//   const match = anchor.href.match(/status\/(\d+)/);
//   return match ? match[1] : null;
// }

// function scrapeTimeline() {
//   const tweets = document.querySelectorAll('article');
//   const newTweets: Tweet[] = [];
//   console.log('Tweets:', tweets);

//   tweets.forEach(tweet => {
//     const id = getTweetId(tweet);
//     if (!id || processedTweetIds.has(id)) return;

//     const textNode: NodeListOf<Element> | null = tweet.querySelectorAll('div[data-testid="tweetText"]');
//     if (textNode) {
//       processedTweetIds.add(id);
//       console.log('Text node:', textNode);
//       // newTweets.push({
//       //   id,
//       //   content: textNode.innerText,
//       //   timestamp: Date.now(),
//       // });
//     }
//   });

//   if (newTweets.length) {
//     console.log('New tweets scraped:', newTweets);
//   }
// }

// function startScraping() {
//   if (scrapingStarted) {
//     return;
//   }
//   scrapingStarted = true;
//   scrapeTimeline();
//   const observer = new MutationObserver(scrapeTimeline);
//   observer.observe(document.body, { childList: true, subtree: true });
// }

// startScraping();

// console.log('content script loaded');
