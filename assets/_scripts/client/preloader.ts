import anime from 'animejs';

type Maybe<T> = {
  [P in keyof T]: T[P] | null;
};

const preloaderDOM: Maybe<{
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
  preloaderDOM.shape = preloaderDOM.preloader?.querySelector('svg.shape') ?? null;
  preloaderDOM.path = preloaderDOM.shape?.querySelector('path') ?? null;

  const setCookie = (name: string, value: string): void => {
    const cookieDesc =
      Object.getOwnPropertyDescriptor(global.Document.prototype, 'cookie') ||
      Object.getOwnPropertyDescriptor(global.HTMLDocument.prototype, 'cookie');

    cookieDesc!.set?.call(document, `${name}=${value}`);
  };

  const getCookieValue = (name: string): string | null => {
    const cookieString = String(document.cookie);

    if (cookieString.indexOf(name) < 0) return null;

    const searchRegex = new RegExp(`${name}=(\\w*);?`);

    const [, value] = cookieString.match(searchRegex)!;

    return value;
  };

  const removePreloader = (animationDuration: number): void => {
    anime
      .timeline({
        duration: animationDuration,
      })
      .add(
        {
          targets: preloaderDOM.preloader,
          easing: 'easeInOutSine',
          translateY: '-200vh',
        },
        0
      )
      .add(
        {
          targets: preloaderDOM.path,
          easing: 'easeOutQuad',
          d: preloaderDOM.path?.getAttribute('pathdata:id'),
          complete: () => {
            document.body.style.overflow = 'auto';
            document.body.setAttribute(HTML_PRELOADER_ATTRIBUTE, String(true));
            // mark preloader as seen for the session
            setCookie(HAS_SEEN_PRELOADER_COOKIE, String(true));
          },
        },
        0
      );
  };

  if (getCookieValue(HAS_SEEN_PRELOADER_COOKIE) === 'true') {
    preloaderDOM.preloader?.setAttribute('style', 'display: none');
    document.body.style.overflow = 'auto';
    document.body.setAttribute(HTML_PRELOADER_ATTRIBUTE, String(true));
  } else {
    // Hide preloader .5s after so the effect is visible
    setTimeout(() => removePreloader(ANIMATION_DURATION), 500);
  }
};

export default initPreloader;
