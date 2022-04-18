import { NavigationRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';

const networkOnly = new NetworkOnly();

const offlineMediaAsset = '/assets/img/horse-rider.svg';

const precacheOfflinePageAssets = (versionNumber?: string): void =>
  precacheAndRoute([
    {
      url: offlineMediaAsset,
      revision: versionNumber,
    },
  ]);

const initOfflineHandler = (versionNumber?: string) => {
  precacheOfflinePageAssets(versionNumber);

  return new NavigationRoute(async (params) => {
    try {
      return await networkOnly.handle(params);
    } catch (err) {
      return new Response(
        new Blob(
          [
            `
            <div style="height: 100vh;display: flex;flex-direction:column;justify-content:center;text-align:center;">
              <img src="${offlineMediaAsset}" alt="illustration of a horse rider" style="height: 30%; width: 100%; object-fit: contain;">
              <h2>You are currently offline</h2>
            </div>
          `,
          ],
          { type: 'text/html' }
        ),
        { status: 200 }
      );
    }
  });
};

export default initOfflineHandler;
