import anime from 'animejs';
import throttle from 'lodash.throttle';

/**
 * @param {Window} global
 * @param {import('./index').DOM.illustrationScroll} illustrationScrollDOM
 */
const handleLandingAnimation = (global, illustrationScrollDOM) => {

    // TODO: device a method to determine the appropriate position to animate our assets to
    const animation = anime.timeline({
        duration: 1200,
        easing: 'cubicBezier(0.64, 0.04, 0.35, 1)',
        elasticity: 200,
        autoplay: false,
    }).add({
        delay: 100,
        translateX: -834,
        translateY: -368,
        width: 50.37,
        height: 90,
        targets: illustrationScrollDOM.illustration,
    }, 0)
        .add({
        delay: 170,
        translateX: 0.5,
        translateY: -980.5,
        targets: illustrationScrollDOM.aboutCTA,
    }, 0);

    global.addEventListener('scroll', throttle(() => {
        const scrollPositionY = global.pageYOffset;
        const wrapperBounds = illustrationScrollDOM.getBoundingClientRect();
        const wrapperOffset = scrollPositionY + wrapperBounds.top;
        const wrapperDistanceFromWindow = wrapperOffset + wrapperBounds.height;

        // only animate while we are the region of the element to be animated
        if(scrollPositionY <=  wrapperDistanceFromWindow) {
            const wrapperHeight = wrapperBounds.height;

            animation.seek(animation.duration * ((scrollPositionY - wrapperOffset) / wrapperHeight));
        }
    }, 250));
};

export default handleLandingAnimation;
