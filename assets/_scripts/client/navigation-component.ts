import { Component, eventbus } from 'gia';
import throttle from 'lodash.throttle';
import { hasClass, toggleClass } from './utils';
import { SEARCH_UI_CLOSE, SEARCH_UI_OPEN } from '../constants';

type NavigationRefs = {
  mobileMenuToggle: HTMLElement[];
};

export default class NavigationComponent extends Component<NavigationRefs> {
  constructor(element: HTMLElement) {
    super(element);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.ref = {};
  }

  headerSearchActive = (): boolean =>
    this.element.hasAttribute('search-expanded');

  setHeaderSearchActive = (): void =>
    this.element.setAttribute('search-expanded', '');

  setHeaderSearchDisabled = (): void =>
    this.element.removeAttribute('search-expanded');

  animateLandingPageHeader = (): void => {
    const toggleBoundary = 10;
    const classToToggle = 'ns-header--hidden';
    const headerOpacityClassName = 'ns-header--scrolled';

    const landingPage = document.querySelector('.ns-landing-screen');
    const landingPageContent = landingPage?.querySelector(
      '.main-content'
    ) as Element;

    if (!landingPage) {
      document.addEventListener(
        'scroll',
        throttle(() => {
          const isOpacityClassNameSet = hasClass(
            this.element,
            headerOpacityClassName
          );
          const pageScrollOffset = window.scrollY;
          const headerTransparencyBoundaryShift = 50;

          requestAnimationFrame(() => {
            if (
              isOpacityClassNameSet &&
              pageScrollOffset < headerTransparencyBoundaryShift
            ) {
              toggleClass(this.element, headerOpacityClassName, false);
            }

            if (
              !isOpacityClassNameSet &&
              pageScrollOffset > headerTransparencyBoundaryShift
            ) {
              // document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.setAttribute("content", "black");
              toggleClass(this.element, headerOpacityClassName, true);
            }
          });
        }, 250)
      );
    }

    if (landingPage) {
      landingPage.addEventListener(
        'scroll',
        throttle(() => {
          const contentRect = landingPageContent.getBoundingClientRect();
          const classIsSet = hasClass(this.element, classToToggle);
          const isOpacityClassNameSet = hasClass(
            this.element,
            headerOpacityClassName
          );

          requestAnimationFrame(() => {
            if (classIsSet && contentRect.y < toggleBoundary) {
              toggleClass(this.element, classToToggle, false);
            }

            if (!classIsSet && contentRect.y > toggleBoundary) {
              if (this.headerSearchActive()) {
                this.setHeaderSearchDisabled();
              }
              toggleClass(this.element, classToToggle, true);
            }

            if (isOpacityClassNameSet && contentRect.y > toggleBoundary) {
              toggleClass(this.element, headerOpacityClassName, false);
            }

            if (!isOpacityClassNameSet && contentRect.y < toggleBoundary) {
              toggleClass(this.element, headerOpacityClassName, true);
            }
          });
        }, 250)
      );
    }
  };

  mount(): void {
    const [MOBILE_TOGGLE] = this.ref?.mobileMenuToggle;

    this.animateLandingPageHeader();

    eventbus.on(SEARCH_UI_CLOSE, () =>
      this.headerSearchActive() ? this.setHeaderSearchDisabled() : null
    );

    eventbus.on(SEARCH_UI_OPEN, () =>
      !this.headerSearchActive() ? this.setHeaderSearchActive() : null
    );

    // initialize handler for mobile toggle
    MOBILE_TOGGLE?.addEventListener('click', () => {
      const openClassName = 'mobile-toggle--open';

      toggleClass(
        MOBILE_TOGGLE,
        openClassName,
        !hasClass(MOBILE_TOGGLE, openClassName)
      );
    });
  }
}
