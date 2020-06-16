/**
 *
 * @param {HTMLElement} el
 * @param {string} className
 * @returns {boolean}
 */
export const hasClass = (el, className) => {
  if (el.classList) return el.classList.contains(className);

  return !!el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
};

/**
 *
 * @param {HTMLElement} el
 * @param {string} className
 */
export const addClass = (el, className) => {
  const classList = className.split(' ');
  if (el.classList) el.classList.add(classList[0]);
  else if (!hasClass(el, classList[0])) el.className += ` ${classList[0]}`;
  if (classList.length > 1) addClass(el, classList.slice(1).join(' '));
};

/**
 *
 * @param {HTMLElement} el
 * @param {string} className
 */
export const removeClass = (el, className) => {
  const classList = className.split(' ');
  if (el.classList) el.classList.remove(classList[0]);
  else if (hasClass(el, classList[0])) {
    const reg = new RegExp(`(\\s|^)${classList[0]}(\\s|$)`);
    el.className = el.className.replace(reg, ' ');
  }
  if (classList.length > 1) removeClass(el, classList.slice(1).join(' '));
};

/**
 *
 * @param {HTMLElement} el
 * @param {string} className
 * @param {boolean} bool
 */
export const toggleClass = (el, className, bool) => {
  return (bool) ?  addClass(el, className) : removeClass(el, className);
};

/**
 *
 * @returns {boolean}
 */
export const osHasReducedMotion = () => {
  if(!window.matchMedia) return false;
  const matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
};

/**
 *
 * @param {object} message
 * @param {string} message.command
 * @param {string} message.key
 * @returns {Promise<{}|*>}
 * @link https://googlechrome.github.io/samples/service-worker/post-message/
 */
export const sendWorkerMessage = (message) => {
  // This wraps the message posting/response in a promise, which will resolve if the response doesn't
  // contain an error, and reject with the error if it does. If you'd prefer, it's possible to call
  // controller.postMessage() and set up the onmessage handler independently of a promise, but this is
  // a convenient wrapper.
  // eslint-disable-next-line consistent-return
  return new Promise((resolve, reject) => {
    const messageChannel = new MessageChannel();

    messageChannel.port1.onmessage = (event) => {
      if (event.data.error) {
        return reject(event.data.error);
      }

      return resolve(event.data);
    };

    if (!navigator.serviceWorker || !navigator.serviceWorker.controller) {
      return reject(new Error('no service worker!!'));
    }

    // This sends the message data as well as transferring messageChannel.port2 to the service worker.
    // The service worker can then use the transferred port to reply via postMessage(), which
    // will in turn trigger the onmessage handler on messageChannel.port1.
    // See https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
    navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
  });
};
