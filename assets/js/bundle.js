import anime from 'animejs';

((global) => {

    const setCookie = (name, value) => global.document.cookie = `${name}=${value}`;

    const getCookieValue = name => {
        const cookieString = String(global.document.cookie);

        if(cookieString.indexOf(name) < 0) return null;

        const searchRegex = new RegExp(`${name}=(\\w*);?`);

        const [, value] = cookieString.match(searchRegex);

        return value;
    };
    
    document.addEventListener('DOMContentLoaded', function () {
        const ANIMATION_DURATION = 2000;
        const HAS_SEEN_PRELOADER_COOKIE = 'eoe_has_seen_preloader';
        const HTML_PRELOADER_ATTRIBUTE = 'data-preloader-displayed';

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
                    global.document.body.setAttribute(HTML_PRELOADER_ATTRIBUTE, String(true));
                    // mark preloader as seen for the session
                    setCookie(HAS_SEEN_PRELOADER_COOKIE, true);
                }
            });
        };

        if(getCookieValue(HAS_SEEN_PRELOADER_COOKIE) === 'true') {
            DOM.preloader.style.display = 'none';
            global.document.body.style.overflow = 'auto';
            global.document.body.setAttribute(HTML_PRELOADER_ATTRIBUTE, String(true));
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


    document.querySelector('#illustration').addEventListener('click', (evt) => {

        const delay = 100;
        const duration = 1300;
        const easing = 'cubicBezier(0.64, 0.04, 0.35, 1)';

        anime({
            targets: '#illustration',
            duration,
            easing,
            translateX: [0, -834],
            translateY: [0, -162],
            width: [239, 50.37],
            height: [427, 90],
            delay: 100
        });

        anime({
            targets: '#info-cta',
            duration,
            easing,
            delay,
            translateX: [0, 2.5],
            translateY: [0, -980.5]
        });

    });

})(window);
