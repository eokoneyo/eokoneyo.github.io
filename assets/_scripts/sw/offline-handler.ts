import { NavigationRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

const networkOnly = new NetworkOnly();

const offlineHandler = new NavigationRoute(async (params) => {
  try {
    return await networkOnly.handle(params);
  } catch (err) {
    return new Response(
      new Blob(
        [
          `
            <div style="height: 100vh;display: flex;flex-direction:column;justify-content:center;text-align:center;">
              <img src="/assets/img/horse-rider.svg" alt="illustration of a horse rider">
              <p>You are offline</p>
            </div>
          `,
        ],
        { type: 'text/html' }
      ),
      { status: 200 }
    );
  }
});

export default offlineHandler;
