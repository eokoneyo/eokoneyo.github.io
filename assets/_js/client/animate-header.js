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

  landingPage.addEventListener('scroll', throttle(() => {
    const contentRect = landingPageContent.getBoundingClientRect();
    const classIsSet = hasClass(DOM.header, 'ns-header--hidden');

    if (classIsSet && contentRect.y < 20 ) {
      toggleClass(DOM.header, 'ns-header--hidden', false);
    }

    if(!classIsSet && contentRect.y > 20) {
      toggleClass(DOM.header, 'ns-header--hidden', true);
    }
  }, 250));
};

export default animateHeader;
