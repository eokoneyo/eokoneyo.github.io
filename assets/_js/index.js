import initPreloader from './preloader';
import handleLandingAnimation from './animate-landing-page';


/**
 * @description Stores references to DOM elements
 * @type {{
 *     preloader: {
 *          shape: {HTMLElement}
 *          path: {HTMLElement}
 *     },
 *     illustrationScroll : {
 *          illustrationWrapper: {HTMLElement}
 *          illustration: {HTMLElement}
 *          aboutCTA: {HTMLElement}
 *     }
 * }}
 */
const DOM = {};

((global) => {

    document.addEventListener('DOMContentLoaded', () => {
        DOM.preloader = global.document.querySelector('.preloader');
        DOM.illustrationScroll = global.document.querySelector('#illustration-scroll-interaction');
        DOM.preloader.shape = DOM.preloader.querySelector('svg.shape');
        DOM.preloader.path = DOM.preloader.shape.querySelector('path');
        DOM.illustrationScroll.illustrationWrapper = DOM.illustrationScroll.querySelector('#illustration-wrapper');
        DOM.illustrationScroll.illustration = DOM.illustrationScroll.querySelector('#illustration');
        DOM.illustrationScroll.aboutCTA = DOM.illustrationScroll.querySelector('#info-cta');

        initPreloader(global, DOM.preloader);
        handleLandingAnimation(global, DOM.illustrationScroll);

        //Do page view tracking
        if(global.ga) {
            global.ga('send', {
                hitType: 'pageview',
                page: global.location.pathname
            });
        }
    });
})(window);
