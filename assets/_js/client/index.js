import logdown from 'logdown';
import initPreloader from './preloader';
import initHeaderNav from './header';
import toggleHeaderMobileMenu from './header-mobile-menu-toggle'

((global, logger) => {
    const { document } = global;

    document.addEventListener('DOMContentLoaded', () => {

        initPreloader(global);

        initHeaderNav(global, logger);

        toggleHeaderMobileMenu(global);

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
})(window, logdown('eoe'));
