'use strict';

;(function (global) {
    document.addEventListener('DOMContentLoaded', function () {
        var ANIMATION_DURATION = 2000;

        var DOM = {};
        DOM.preloader = global.document.querySelector('.preloader');
        DOM.shape = DOM.preloader.querySelector('svg.shape');
        DOM.path = DOM.shape.querySelector('path');

        setTimeout(function () {
            anime({
                targets: DOM.preloader,
                duration: ANIMATION_DURATION,
                easing: 'easeInOutSine',
                translateY: '-200vh'
            });

            anime({
                targets: DOM.path,
                duration: ANIMATION_DURATION,
                easing: 'easeOutQuad',
                d: DOM.path.getAttribute('pathdata:id'),
                complete: function complete() {
                    global.document.body.style.overflow = 'auto';
                }
            });
        }, 1000);

        //Do page view tracking
        if (global.ga) {
            global.ga('send', {
                hitType: 'pageview',
                page: global.location.pathname
            });
        }
    });
})(window);