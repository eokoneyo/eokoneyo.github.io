import anime from 'animejs';
import throttle from 'lodash.throttle';

/**
 *
 * @param global {Window}
 * @param illustrationWrapperDOM {import('./index').DOM.illustrationWrapper}
 */
const handleLandingAnimation = (global, illustrationWrapperDOM) => {
    let frame;
    let lastScrollY = 0;
    let wrapperBounds;

    const delay = 100;
    const elasticity = 200;
    const duration = 1300;
    const easing = 'cubicBezier(0.64, 0.04, 0.35, 1)';

    // TODO: device a method to determine where to scroll the user to, also handle resize
    const animation1 = anime({
        duration,
        easing,
        delay,
        elasticity,
        translateX: -834,
        translateY: -162,
        width: 50.37,
        height: 90,
        autoplay: false,
        targets: illustrationWrapperDOM.illustration,
    });

    const animation2 = anime({
        duration,
        easing,
        delay,
        elasticity,
        translateX: 2.5,
        translateY: -980.5,
        autoplay: false,
        targets: illustrationWrapperDOM.aboutCTA,
    });

    const animateIllustration = () => {
        // TODO: calculate scroll percent properly

        const wrapperHeight = wrapperBounds.height;

        const scrollPercent = (lastScrollY / wrapperHeight) * 100;
        animation1.seek((scrollPercent / 100) * animation1.duration);
        animation2.seek((scrollPercent / 100) * animation2.duration);

        frame = null;
    };

    global.addEventListener('scroll', throttle(() => {
        lastScrollY = global.document.documentElement.scrollTop || global.document.body.scrollTop;
        wrapperBounds = illustrationWrapperDOM.getBoundingClientRect();

        if (!frame) {
            frame = requestAnimationFrame(animateIllustration);
        }

    }, 250));
};

export default handleLandingAnimation;
