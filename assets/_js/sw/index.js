import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { setCacheNameDetails, skipWaiting, clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing/registerRoute';
import { CacheFirst } from 'workbox-strategies/CacheFirst';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import setupListenerForSearchRequest, { precacheSearchData } from './sw-lunr-search';

/**
 * serviceworker for website
 * @module sw
 */
((global) => {
  skipWaiting();
  clientsClaim();

  setCacheNameDetails({
    prefix: 'eoe-website',
  });

  precacheSearchData();

  // eslint-disable-next-line no-restricted-globals,no-underscore-dangle
  precacheAndRoute(self.__WB_MANIFEST);

  registerRoute(
    /.*\/assets\/fonts\/.*\.(woff2|ttf)$/,
    new CacheFirst({
      cacheName: 'site-font',
      plugins: [
        new CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 365, // cache fonts for a year
        }),
      ],
    }),
  );

  cleanupOutdatedCaches();

  global.addEventListener('message', async (event) => {
    let responseMessage = {};

    switch (event.data.command) {
      case 'search:request':
        responseMessage = { ...responseMessage, ...await setupListenerForSearchRequest(event.data.key)};
        break;
      default:
        responseMessage = { ...responseMessage, msg: 'nothing to see'};
        break;
    }

    event.ports[0].postMessage(responseMessage);
  });
// eslint-disable-next-line no-restricted-globals
})(self);
