/// <reference lib="webworker" />

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { setCacheNameDetails, clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import offlineHandler from './offline-handler';
import {
  setupListenerForSearchRequest,
  precacheSearchData,
} from './sw-lunr-search';
import { SEARCH_REQ } from '../constants';

declare const self: ServiceWorkerGlobalScope;

/**
 * serviceworker for website
 * @module sw
 */
(async (global) => {
  await self.skipWaiting();
  clientsClaim();

  // get version from sw query string
  const swVersion = new URL(global.location.href).searchParams.get('version');

  setCacheNameDetails({
    prefix: 'eoe-website',
  });

  precacheSearchData(swVersion ?? '');

  // eslint-disable-next-line no-restricted-globals,no-underscore-dangle
  precacheAndRoute(self.__WB_MANIFEST);

  cleanupOutdatedCaches();

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
    })
  );

  registerRoute(offlineHandler);

  global.addEventListener('message', async (event) => {
    let responseMessage = {};

    switch (event.data.command) {
      case SEARCH_REQ:
        responseMessage = {
          ...responseMessage,
          data: await setupListenerForSearchRequest(event.data.key),
        };
        break;
      default:
        responseMessage = { ...responseMessage, message: 'nothing to see' };
        break;
    }

    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage(responseMessage);
    }
  });

  // eslint-disable-next-line no-restricted-globals
})(self);
