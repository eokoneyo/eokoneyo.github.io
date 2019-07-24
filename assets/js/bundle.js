;(function (global) {

    document.addEventListener('DOMContentLoaded', function () {
        const ANIMATION_DURATION = 2000;

        const DOM = {};
        DOM.preloader = document.querySelector('.preloader');
        DOM.shape = DOM.preloader.querySelector('svg.shape');
        DOM.path = DOM.shape.querySelector('path');
        
        setTimeout(() => {
            anime({
                targets: DOM.preloader,
                duration: ANIMATION_DURATION,
                easing: 'easeInOutSine',
                translateY: '-200vh',
            });
      
            anime({
                targets: DOM.path,
                duration: ANIMATION_DURATION,
                easing: 'easeOutQuad',
                d: DOM.path.getAttribute('pathdata:id'),
                complete: () => {
                  document.body.style.overflow = 'auto';
                  DOM.preloader.style.display = 'none'
                }
            });
        }, 1000);
    });

})(window);
