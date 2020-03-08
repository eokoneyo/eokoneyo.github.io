import initPreloader from './preloader';
import handleLandingAnimation from './animate-landing-page';


/**
 * @description Stores references to DOM elements
 * @type {{
 *     preloader: {
 *         shape: {HTMLElement}
 *         path: {HTMLElement}
 *
 *     },
 *     illustrationWrapper: {
 *         illustration: {HTMLElement}
 *         aboutCTA: {HTMLElement}
 *     }
 * }}
 */
const DOM = {};

((global) => {

    document.addEventListener('DOMContentLoaded', () => {
        DOM.preloader = global.document.querySelector('.preloader');
        DOM.illustrationWrapper = global.document.querySelector('#illustration-wrapper');
        DOM.preloader.shape = DOM.preloader.querySelector('svg.shape');
        DOM.preloader.path = DOM.preloader.shape.querySelector('path');
        DOM.illustrationWrapper.illustration = DOM.illustrationWrapper.querySelector('#illustration');
        DOM.illustrationWrapper.aboutCTA = DOM.illustrationWrapper.querySelector('#info-cta');

        initPreloader(global, DOM.preloader);
        handleLandingAnimation(global, DOM.illustrationWrapper);

        //Do page view tracking
        if(global.ga) {
            global.ga('send', {
                hitType: 'pageview',
                page: global.location.pathname
            });
        }
    });
})(window);
