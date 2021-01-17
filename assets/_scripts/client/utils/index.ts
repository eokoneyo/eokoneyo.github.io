export const hasClass = (el: HTMLElement, className: string): boolean => {
  if (el.classList) return el.classList.contains(className);

  return !!el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
};

export const setAttributes = (
  el: HTMLElement,
  attrs: Record<string, string>
): void => {
  Object.keys(attrs).forEach((key) => el.setAttribute(key, attrs[key]));
};

export const addClass = (el: HTMLElement, className: string): void => {
  const classList = className.split(' ');
  if (el.classList) el.classList.add(classList[0]);
  else if (!hasClass(el, classList[0])) {
    setAttributes(el, {
      class: `${el.className} ${classList[0]}`,
    });
  }
  if (classList.length > 1) addClass(el, classList.slice(1).join(' '));
};

export const removeClass = (el: HTMLElement, className: string): void => {
  const classList = className.split(' ');
  if (el.classList) el.classList.remove(classList[0]);
  else if (hasClass(el, classList[0])) {
    const reg = new RegExp(`(\\s|^)${classList[0]}(\\s|$)`);
    setAttributes(el, {
      class: el.className.replace(reg, ' '),
    });
  }
  if (classList.length > 1) removeClass(el, classList.slice(1).join(' '));
};

export const toggleClass = (
  el: HTMLElement,
  className: string,
  bool: boolean
): void => (bool ? addClass(el, className) : removeClass(el, className));

export const osHasReducedMotion = (): boolean => {
  if (!window.matchMedia) return false;
  const matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
};

export const setCookie = (name: string, value: string): void => {
  const cookieDesc =
    Object.getOwnPropertyDescriptor(window.Document.prototype, 'cookie') ||
    Object.getOwnPropertyDescriptor(window.HTMLDocument.prototype, 'cookie');

  cookieDesc?.set?.call(document, `${name}=${value}`);
};

export const getCookieValue = (name: string): string | null => {
  const cookieString = String(document.cookie);

  if (cookieString.indexOf(name) < 0) return null;

  const searchRegex = new RegExp(`${name}=(\\w*);?`);

  const [, value] = cookieString.match(searchRegex)!;

  return value;
};

/**
 * @link https://googlechrome.github.io/samples/service-worker/post-message/
 */
export const sendWorkerMessage = <T>(message: {
  command: string;
  key: string;
}): Promise<T> =>
  // eslint-disable-next-line consistent-return
  new Promise((resolve, reject) => {
    if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
      return reject(new Error('no service worker!!'));
    }

    const messageChannel = new MessageChannel();

    messageChannel.port1.onmessage = (event) => {
      if (event.data.error) {
        return reject(event.data.error);
      }

      return resolve(event.data);
    };

    // This sends the message data as well as transferring messageChannel.port2 to the service worker.
    // The service worker can then use the transferred port to reply via postMessage(), which
    // will in turn trigger the onmessage handler on messageChannel.port1.
    // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
    navigator.serviceWorker.controller.postMessage(message, [
      messageChannel.port2,
    ]);
  });
