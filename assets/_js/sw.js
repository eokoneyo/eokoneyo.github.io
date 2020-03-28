import { precacheAndRoute } from 'workbox-precaching';
import { setCacheNameDetails, skipWaiting, clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing/registerRoute';
import { CacheFirst } from 'workbox-strategies/CacheFirst';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

(() => {
  skipWaiting();
  clientsClaim();

  setCacheNameDetails({
    prefix: 'eoe-website',
  });

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

  // eslint-disable-next-line no-restricted-globals,no-underscore-dangle
  precacheAndRoute(self.__WB_MANIFEST);
})();
