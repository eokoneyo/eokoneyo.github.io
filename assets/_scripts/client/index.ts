import { loadComponents, createInstance } from 'gia';
import initPreloader from './preloader';
import NavigationComponent from './navigation-component';

((global): void => {
    const { document } = global;

    document.addEventListener('DOMContentLoaded', () => {

        initPreloader(global);

        loadComponents({
            NavigationComponent
        })

        // lazy load image zoom feature as progressive enhancement
        import(/* webpackChunkName: "image-zoom" */ './image-zoom');

        const playlists = document.querySelector('#Playlists')

        // request spotify playlist only when user is on the playlist page
        if(playlists) {
            import(/* webpackChunkName: "playlist" */ './playlists')
              .then(({ default: PlaylistComponent }) => {
                  const instance = createInstance(playlists as HTMLElement, 'Playlists', PlaylistComponent);
                  // eslint-disable-next-line no-underscore-dangle
                  instance._load();
              })
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
