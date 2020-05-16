import anime from 'animejs';

/**
 *
 * @type {{
 *   preloader: HTMLElement,
 *   shape: SVGElement,
 *   path:SVGElement,
 * }}
 */
const preloaderDOM = {};

/**
 *
 * @param global {Window}
 */
const initPreloader = (global) => {
    const ANIMATION_DURATION = 2000;
    const HAS_SEEN_PRELOADER_COOKIE = 'eoe_has_seen_preloader';
    const HTML_PRELOADER_ATTRIBUTE = 'data-preloader-displayed';

    const { document } = global;

    preloaderDOM.preloader = document.querySelector('.preloader');
    preloaderDOM.shape = preloaderDOM.preloader.querySelector('svg.shape');
    preloaderDOM.path = preloaderDOM.shape.querySelector('path');

    /**
     *
     * @param name
     * @param value
     */
    const setCookie = (name, value) => {
        const cookieDesc = Object.getOwnPropertyDescriptor(global.Document.prototype, 'cookie') ||
          Object.getOwnPropertyDescriptor(global.HTMLDocument.prototype, 'cookie');

        cookieDesc.set.call(document, `${name}=${value}`);
    };

    /**
     * @description Helper for getting value of a named cookie
     * @param name
     * @returns {null|string}
     */
    const getCookieValue = name => {
        const cookieString = String(document.cookie);

        if (cookieString.indexOf(name) < 0) return null;

        const searchRegex = new RegExp(`${name}=(\\w*);?`);

        const [, value] = cookieString.match(searchRegex);

        return value;
    };

    const removePreloader = (animationDuration) => {
        anime.timeline({
            duration: animationDuration,
        })
            .add({
                targets: preloaderDOM.preloader,
                easing: 'easeInOutSine',
                translateY: '-200vh',
            }, 0)
            .add({
                targets: preloaderDOM.path,
                easing: 'easeOutQuad',
                d: preloaderDOM.path.getAttribute('pathdata:id'),
                complete: () => {
                    document.body.style.overflow = 'auto';
                    document.body.setAttribute(HTML_PRELOADER_ATTRIBUTE, String(true));
                    // mark preloader as seen for the session
                    setCookie(HAS_SEEN_PRELOADER_COOKIE, true);
                }
            }, 0);
    };

    if (getCookieValue(HAS_SEEN_PRELOADER_COOKIE) === 'true') {
        preloaderDOM.preloader.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.body.setAttribute(HTML_PRELOADER_ATTRIBUTE, String(true));
    } else {
        // Hide preloader .5s after so the effect is visible
        setTimeout(() => removePreloader(ANIMATION_DURATION), 500);
    }
};

export default initPreloader;
