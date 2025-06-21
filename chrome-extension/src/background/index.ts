import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';
import { tweetParser } from '../tweet-parser';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('Background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");

chrome.runtime.onMessage.addListener((message, sender) => {
  console.log('Sender', sender);
  console.log('📨 Message received in background:', message);

  console.log('Parsing tweets');
  const parsedTweets = tweetParser.parseResponse(JSON.parse(message.data.response));
  console.log(parsedTweets);
  return true;
});
