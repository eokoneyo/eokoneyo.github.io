import anime from 'animejs';

/**
 *
 * @param global {Window}
 * @param preloaderDOM {import('./index').DOM.preloader}
 */
const initPreloader = (global, preloaderDOM) => {
    const ANIMATION_DURATION = 2000;
    const HAS_SEEN_PRELOADER_COOKIE = 'eoe_has_seen_preloader';
    const HTML_PRELOADER_ATTRIBUTE = 'data-preloader-displayed';

    /**
     * @param name {string}
     * @param value {boolean}
     * @returns {string}
     */
    const setCookie = (name, value) => global.document.cookie = `${name}=${value}`;

    /**
     * @description Helper for getting cookie value of a named cookie
     * @param name
     * @returns {null|boolean}
     */
    const getCookieValue = name => {
        const cookieString = String(global.document.cookie);

        if (cookieString.indexOf(name) < 0) return null;

        const searchRegex = new RegExp(`${name}=(\\w*);?`);

        const [, value] = cookieString.match(searchRegex);

        return Boolean(value);
    };

    const removePreloader = (animationDuration) => {

        anime.timeline({
            duration: animationDuration,
        })
            .add({
                targets: preloaderDOM,
                easing: 'easeInOutSine',
                translateY: '-200vh',
            }, 0)
            .add({
                targets: preloaderDOM.path,
                easing: 'easeOutQuad',
                d: preloaderDOM.path.getAttribute('pathdata:id'),
                complete: () => {
                    global.document.body.style.overflow = 'auto';
                    global.document.body.setAttribute(HTML_PRELOADER_ATTRIBUTE, String(true));
                    // mark preloader as seen for the session
                    setCookie(HAS_SEEN_PRELOADER_COOKIE, true);
                }
            }, 0);
    };

    if (getCookieValue(HAS_SEEN_PRELOADER_COOKIE)) {
        preloaderDOM.style.display = 'none';
        global.document.body.style.overflow = 'auto';
        global.document.body.setAttribute(HTML_PRELOADER_ATTRIBUTE, String(true));
    } else {
        // Hide preloader .5s after so the effect is visible
        setTimeout(() => removePreloader(ANIMATION_DURATION), 500);
    }
};

export default initPreloader;
