import anime from 'animejs';
import {
  setCookie,
  getCookieValue,
  changeStatusBarThemeColor,
} from './utils/dom';

type Nullable<T> = { [P in keyof T]: T[P] | null };

const preloaderDOM: Nullable<{
  preloader: HTMLElement;
  shape: SVGElement;
  path: SVGElement;
}> = {
  path: null,
  shape: null,
  preloader: null,
};

const initPreloader = (global: Window): void => {
  const ANIMATION_DURATION = 2000;
  const HAS_SEEN_PRELOADER_COOKIE = 'eoe_has_seen_preloader';
  const HTML_PRELOADER_ATTRIBUTE = 'data-preloader-displayed';

  const { document } = global;

  preloaderDOM.preloader = document.querySelector('.preloader');
  preloaderDOM.shape =
    preloaderDOM.preloader?.querySelector('svg.shape') ?? null;
  preloaderDOM.path = preloaderDOM.shape?.querySelector('path') ?? null;

  const removePreloader = (animationDuration: number): void => {
    anime
      .timeline({
        duration: animationDuration,
        complete() {
          changeStatusBarThemeColor('#ffffff');
        },
      })
      .add(
        {
          targets: Array.prototype.slice.call(
            preloaderDOM.preloader?.querySelector('.content-wrapper')?.children,
            0
          ),
          opacity: '0',
          easing: 'easeInOutExpo',
        },
        0
      )
      .add(
        {
          delay: 1000,
          targets: preloaderDOM.preloader,
          easing: 'easeInOutSine',
          translateY: '-200vh',
        },
        0
      )
      .add(
        {
          delay: 1000,
          targets: preloaderDOM.path,
          easing: 'easeOutQuad',
          d: preloaderDOM.path?.getAttribute('pathdata:id'),
          complete: () => {
            document.body.style.overflow = 'auto';
            document.body.setAttribute(HTML_PRELOADER_ATTRIBUTE, String(true));
            // mark preloader as seen for the session
            setCookie(HAS_SEEN_PRELOADER_COOKIE, true);
          },
        },
        0
      );
  };

  if (getCookieValue(HAS_SEEN_PRELOADER_COOKIE)) {
    preloaderDOM.preloader?.setAttribute('style', 'display: none');
    document.body.style.overflow = 'auto';
    document.body.setAttribute(HTML_PRELOADER_ATTRIBUTE, String(true));
  } else {
    // Hide preloader .5s after so the effect is visible
    setTimeout(() => removePreloader(ANIMATION_DURATION), 500);
  }
};

export default initPreloader;
