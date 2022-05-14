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
            <html lang="en">
              <head>
                 <title>Offline | - </title>
                 <style>
                    .container { height: 100vh; display: flex; flex-direction:column; justify-content:center; text-align:center; }
                    .offline-img { height: 30%; width: 100%; object-fit: contain; }
                 </style>
              </head>
              <body>
                <div class="container">
                  <img src="${offlineMediaAsset}" alt="illustration of a horse rider" class="offline-img">
                  <h2>You are currently offline</h2>
                </div>
              </body>
            </html>
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
