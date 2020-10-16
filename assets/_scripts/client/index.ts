import { loadComponents } from 'gia';
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

        // Do page view tracking
        if (global.ga) {
            global.ga('send', {
                hitType: 'pageview',
                page: global.location.pathname,
            });
        }
    });
})(window);
