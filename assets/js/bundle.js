;(function (global) {
    
    const setCookie = (name, value) => global.document.cookie = `${name}=${value}`;

    const getCookieValue = name => {
        const cookieString = String(global.document.cookie);

        if(cookieString.indexOf(name) < 0) return null;

        const searchRegex = new RegExp(`${name}=(\\w*);?`);

        const [, value] = cookieString.match(searchRegex);

        return value;
    }
    
    document.addEventListener('DOMContentLoaded', function () {
        const ANIMATION_DURATION = 2000;
        const HAS_SEEN_PRELOADER_COOKIE = 'eoe_has_seen_preloader';

        const DOM = {};
        DOM.preloader = global.document.querySelector('.preloader');
        DOM.shape = DOM.preloader.querySelector('svg.shape');
        DOM.path = DOM.shape.querySelector('path');

        const removePreloader = (animationDuration) => {
            anime({
                targets: DOM.preloader,
                duration: animationDuration,
                easing: 'easeInOutSine',
                translateY: '-200vh',
            });
      
            anime({
                targets: DOM.path,
                duration: animationDuration,
                easing: 'easeOutQuad',
                d: DOM.path.getAttribute('pathdata:id'),
                complete: () => {
                    global.document.body.style.overflow = 'auto';
                    // mark preloader as seen for the session
                    setCookie(HAS_SEEN_PRELOADER_COOKIE, true);
                }
            });
        }

        if(getCookieValue(HAS_SEEN_PRELOADER_COOKIE) === 'true') {
            DOM.preloader.style.display = 'none';
            global.document.body.style.overflow = 'auto';
        } else {
            setTimeout(() => removePreloader(ANIMATION_DURATION), 1000);
        }

        //Do page view tracking
        if(global.ga) {
            global.ga('send', {
                hitType: 'pageview',
                page: global.location.pathname
            });
        }
    });

})(window);
