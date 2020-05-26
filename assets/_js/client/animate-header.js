import throttle from 'lodash.throttle';
import { hasClass, toggleClass } from './utils';

/**
 *
 * @param global
 * @param {object} DOM
 * @param {HTMLElement} DOM.landingPage
 * @param {HTMLElement} DOM.header
 */
const animateHeader = (global, DOM) => {

  const toggleBoundary = 10;
  const classToToggle = 'ns-header--hidden';

  const { landingPage } = DOM;

  const landingPageContent = DOM.landingPage.querySelector('.main-content');

  landingPage.addEventListener('scroll', throttle(() => {
    const contentRect = landingPageContent.getBoundingClientRect();
    const classIsSet = hasClass(DOM.header, classToToggle);

    requestAnimationFrame(() => {
      if (classIsSet && contentRect.y < toggleBoundary) {
        toggleClass(DOM.header, classToToggle, false);
      }

      if(!classIsSet && contentRect.y > toggleBoundary) {
        toggleClass(DOM.header, classToToggle, true);
      }
    });
  }, 250));
};

export default animateHeader;
