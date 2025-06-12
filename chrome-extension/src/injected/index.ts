export {};

declare global {
  interface XMLHttpRequest {
    _interceptedUrl?: string | URL;
    _interceptedMethod?: string;
  }
}

(function () {
  'use strict';

  // Store original functions
  const originalFetch = window.fetch;
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  // Helper function to check if URL should be intercepted
  function shouldIntercept(url?: string | URL): boolean {
    if (url === undefined) {
      return false;
    }

    if (url instanceof URL) {
      url = url.toString();
    }

    return url.includes('x.com') && (url.includes('HomeTimeline') || url.includes('TweetDetail'));
  }

  // Override fetch
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);
    const url = args[0].toString();

    if (shouldIntercept(url)) {
      try {
        const clonedResponse = response.clone();
        const responseText = await clonedResponse.text();

        window.postMessage(
          {
            type: 'API_RESPONSE_INTERCEPTED',
            method: 'fetch',
            url: url,
            response: responseText,
            status: response.status,
            timestamp: Date.now(),
          },
          '*',
        );
      } catch (error) {
        console.error('Error intercepting fetch response:', error);
      }
    }

    return response;
  };

  // Override XMLHttpRequest
  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string | URL,
    async: boolean = true,
    username?: string | null,
    password?: string | null,
  ) {
    this._interceptedUrl = url;
    this._interceptedMethod = method;
    return originalXHROpen.apply(this, [method, url, async, username, password]);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    if (shouldIntercept(this._interceptedUrl)) {
      const originalOnReadyStateChange = this.onreadystatechange;

      this.onreadystatechange = function (ev) {
        if (this.readyState === 4 && this.status >= 200 && this.status < 300) {
          try {
            window.postMessage(
              {
                type: 'API_RESPONSE_INTERCEPTED',
                method: 'this',
                url: this._interceptedUrl,
                response: this.responseText,
                status: this.status,
                timestamp: Date.now(),
              },
              '*',
            );
          } catch (error) {
            console.error('Error intercepting XHR response:', error);
          }
        }

        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.apply(this, [ev]);
        }
      };
    }

    return originalXHRSend.apply(this, args);
  };

  console.log('X.com API interceptor loaded');
})();
