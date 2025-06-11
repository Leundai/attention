(function () {
  'use strict';

  // Store original functions
  const originalFetch = window.fetch;
  const originalXHROpen = XMLHttpRequest.prototype.open;
  const originalXHRSend = XMLHttpRequest.prototype.send;

  // Helper function to check if URL should be intercepted
  function shouldIntercept(url) {
    return url && url.includes('x.com') && (url.includes('HomeTimeline') || url.includes('TweetDetail'));
  }

  // Override fetch
  window.fetch = async function (...args) {
    const response = await originalFetch.apply(this, args);

    const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;

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
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._interceptedUrl = url;
    this._interceptedMethod = method;
    return originalXHROpen.apply(this, [method, url, ...rest]);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    const xhr = this;

    if (shouldIntercept(xhr._interceptedUrl)) {
      const originalOnReadyStateChange = xhr.onreadystatechange;

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300) {
          try {
            window.postMessage(
              {
                type: 'API_RESPONSE_INTERCEPTED',
                method: 'xhr',
                url: xhr._interceptedUrl,
                response: xhr.responseText,
                status: xhr.status,
                timestamp: Date.now(),
              },
              '*',
            );
          } catch (error) {
            console.error('Error intercepting XHR response:', error);
          }
        }

        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.apply(this, arguments);
        }
      };
    }

    return originalXHRSend.apply(this, args);
  };

  console.log('X.com API interceptor loaded');
})();
