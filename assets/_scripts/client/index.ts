import { loadComponents, createInstance, config as giaConfig } from 'gia';
import initPreloader from './preloader';
import NavigationComponent from './navigation-component';
import SearchComponent from './search-component';

((global): void => {
  const { document } = global;

  document.addEventListener('DOMContentLoaded', () => {
    initPreloader(global);

    if (process.env.NODE_ENV === 'production') {
      giaConfig.set('log', false);
    }

    loadComponents({
      NavigationComponent,
      SearchComponent,
    });

    const playlists = document.querySelector('#Playlists');
    const imageZoom = document.getElementsByClassName('js-image-zoom');

    // lazy load image zoom feature when page has an image zoom component
    if (imageZoom.length > 0) {
      import(/* webpackChunkName: "image-zoom" */ './image-zoom').then(
        ({ default: ImageZoomComponent }) => {
          const imageZoomArray: InstanceType<typeof ImageZoomComponent>[] = [];

          Array.prototype.forEach.call(imageZoom, (imageZoomElm, i) => {
            const instance = createInstance(
              imageZoomElm,
              `imagezoom-${i}`,
              ImageZoomComponent,
              { key: i }
            );
            // eslint-disable-next-line no-underscore-dangle
            instance._load();
            imageZoomArray.push(instance);
          });

          // close Zoom Image lightbox on Esc
          global.addEventListener('keydown', (event) => {
            if (
              (event.keyCode && event.keyCode === 27) ||
              (event.key && event.key.toLowerCase() === 'esc')
            ) {
              imageZoomArray.forEach((imageZoomComp) => {
                imageZoomComp.input.removeAttribute('checked');
                ImageZoomComponent.shouldToggle(imageZoomComp);
              });
            }
          });
        }
      );
    }

    // lazy load spotify playlist only when user is on the playlist page
    if (playlists) {
      import(/* webpackChunkName: "playlist" */ './playlists').then(
        ({ default: PlaylistComponent }) => {
          const instance = createInstance(
            playlists as HTMLElement,
            'Playlists',
            PlaylistComponent
          );
          // eslint-disable-next-line no-underscore-dangle
          instance._load();
        }
      );
    }

    // Do page view tracking
    if (global.ga) {
      global.ga('send', {
        hitType: 'pageview',
        page: global.location.pathname,
      });
    }
  });
})(window);
