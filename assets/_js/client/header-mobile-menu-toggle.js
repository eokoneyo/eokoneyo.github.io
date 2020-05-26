import { hasClass, toggleClass } from './utils';

const toggleHeaderMobileMenu = (global) => {
  const { document } = global;

  const MOBILE_TOGGLE = document.querySelector('.js-mobile-menu-toggle');

  MOBILE_TOGGLE.addEventListener('click', () => {
    const openClassName = 'mobile-toggle--open';

    toggleClass(MOBILE_TOGGLE, openClassName, !hasClass(MOBILE_TOGGLE, openClassName))
  });
};

export default toggleHeaderMobileMenu;
