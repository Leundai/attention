import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

console.log('Background loaded');
console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");

chrome.runtime.onMessage.addListener((message, sender) => {
  console.log('Sender', sender);
  console.log('📨 Message received in background:', message);

  // if (message.type === 'GREETING') {
  //   // Optionally respond
  //   sendResponse({ reply: 'Hi from background!' });
  // }

  // Returning true tells Chrome you'll send a response asynchronously
  return true;
});
