import initPreloader from './preloader';
import initSearch from './search';
import initModals from './modal';

/**
 * @description Stores references to DOM elements
 * @type {{
 *     preloader: {
 *          shape: SVGElement
 *          path: SVGPathElement
 *     },
 *     header: HTMLElement,
 *     landingPage: HTMLElement,
 *     landingPageContent: HTMLElement
 * }}
 */
const DOM = {};

((global) => {
    const { document } = global;

    document.addEventListener('DOMContentLoaded', () => {
        DOM.preloader = global.document.querySelector('.preloader');
        DOM.header = global.document.querySelector('#header');
        DOM.landingPage = global.document.querySelector('.ns-landing-screen');
        DOM.preloader.shape = DOM.preloader.querySelector('svg.shape');
        DOM.preloader.path = DOM.preloader.shape.querySelector('path');
        initPreloader(global, DOM.preloader);

        initModals(global);

        initSearch(global);

        // function to handle header transition on landing page
        if (DOM.landingPage) {
            (async () => {
                const { default: animateHeader } = await import(/* webpackChunkName: "animate-landing-header" */ './animate-header');
                animateHeader(global, DOM);
            })();
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
