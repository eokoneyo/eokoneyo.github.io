import throttle from 'lodash.throttle';
import { hasClass, toggleClass } from '../utils';


/**
 *
 * @param global
 * @param {import('./index').DOM} DOM
 */
const animateHeader = (global, DOM) => {

  const { landingPage } = DOM;

  const landingPageContent = DOM.landingPage.querySelector('.main-content');

  const toggleBoundary = 20;

  landingPage.addEventListener('scroll', throttle(() => {
    const contentRect = landingPageContent.getBoundingClientRect();
    const classIsSet = hasClass(DOM.header, 'ns-header--hidden');

    if (classIsSet && contentRect.y < toggleBoundary ) {
      toggleClass(DOM.header, 'ns-header--hidden', false);
    }

    if(!classIsSet && contentRect.y > toggleBoundary) {
      toggleClass(DOM.header, 'ns-header--hidden', true);
    }
  }, 250));
};

export default animateHeader;
