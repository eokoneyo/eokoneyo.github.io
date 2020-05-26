import * as Util from './utils';

class Modal {
  constructor(element) {
    this.element = element;
    this.triggers = document.querySelectorAll(`[aria-controls="${this.element.getAttribute('id')}"]`);
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.selectedTrigger = null;
    this.showClass = 'modal--is-visible';
    this.initModal();
  }

  initModal() {
    // open modal when clicking on trigger buttons
    if (this.triggers) {
      Array.prototype.forEach.call(this.triggers, trigger => trigger.addEventListener('click', (event) => {
        event.preventDefault();
        this.selectedTrigger = event.target;
        this.showModal();
        this.initModalEvents();
      }));
    }

    // listen to the openModal event -> open modal without a trigger button
    this.element.addEventListener('openModal', (event) => {
      if (event.detail) this.selectedTrigger = event.detail;
      this.showModal();
      this.initModalEvents();
    });

    // listen to the closeModal event -> close modal without a trigger button
    this.element.addEventListener('closeModal', (event) => {
      if (event.detail) this.selectedTrigger = event.detail;
      this.closeModal();
    });
  }

  showModal() {
    Util.addClass(this.element, this.showClass);
    this.getFocusableElements();
    this.firstFocusable.focus();

    // wait for the end of transitions before moving focus
    const handleTransitionEnd = () => {
      this.firstFocusable.focus();
      this.element.removeEventListener('transitionend', handleTransitionEnd);
    };

    this.element.addEventListener('transitionend', handleTransitionEnd);
    this.emitModalEvents('modalIsOpen');
  };

  closeModal() {
    if (!Util.hasClass(this.element, this.showClass)) return;
    Util.removeClass(this.element, this.showClass);
    this.firstFocusable = null;
    this.lastFocusable = null;
    if (this.selectedTrigger) this.selectedTrigger.focus();
    // remove listeners
    this.cancelModalEvents();
    this.emitModalEvents('modalIsClose');
  }

  initModalEvents() {
    // add event listeners
    this.element.addEventListener('keydown', this);
    this.element.addEventListener('click', this);
  }

  cancelModalEvents() {
    // remove event listeners
    this.element.removeEventListener('keydown', this);
    this.element.removeEventListener('click', this);
  }

  handleEvent(event) {
    switch (event.type) {
      case 'click': {
        this.initClick(event);
      }
      case 'keydown': {
        this.initKeyDown(event);
      }
    }
  }

  initKeyDown(event) {
    if (event.keyCode && event.keyCode === 9 || event.key && event.key === 'Tab') {
      // trap focus inside modal
      this.trapFocus(event);
    } else if ((event.keyCode && event.keyCode === 13 || event.key && event.key === 'Enter') && event.target.closest('.js-modal__close')) {
      event.preventDefault();
      this.closeModal(); // close modal when pressing Enter on close button
    }
  }

  initClick(event) {
    // close modal when clicking on close button or modal bg layer
    if (!event.target.closest('.js-modal__close') && !Util.hasClass(event.target, 'js-modal')) return;
    event.preventDefault();
    this.closeModal();
  }

  trapFocus(event) {
    if (this.firstFocusable === document.activeElement && event.shiftKey) {
      // on Shift+Tab -> focus last focusable element when focus moves out of modal
      event.preventDefault();
      this.lastFocusable.focus();
    }
    if (this.lastFocusable === document.activeElement && !event.shiftKey) {
      // on Tab -> focus first focusable element when focus moves out of modal
      event.preventDefault();
      this.firstFocusable.focus();
    }
  }

  getFocusableElements() {
    // get all focusable elements inside the modal
    const allFocusable = this.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
    this.getFirstVisible(allFocusable);
    this.getLastVisible(allFocusable);
  }

  getFirstVisible(elements) {
    // get first visible focusable element inside the modal
    Array.prototype.forEach.call(elements, (element) => {
      if (element.offsetWidth || element.offsetHeight || element.getClientRects().length) {
        this.firstFocusable = element;
        return true;
      }

      return false;
    });
  }

  getLastVisible(elements) {
    // get last visible focusable element inside the modal
    for (let i = elements.length - 1; i >= 0; i--) {
      if (elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length) {
        this.lastFocusable = elements[i];
        return true;
      }
    }
  }

  emitModalEvents(eventName) {
    const event = new CustomEvent(eventName, { detail: this.selectedTrigger });
    this.element.dispatchEvent(event);
  }
}

/**
 *
 * @param {Window} global
 */
const initModals = (global) => {
  const { document } = global;

  // initialize the Modal objects
  const modals = document.getElementsByClassName('js-modal');

  if (modals.length > 0) {
    const modalArrays = [];
    Array.prototype.forEach.call(modals, modal => modalArrays.push(new Modal(modal)));

    window.addEventListener('keydown', (event) => { // close modal window on esc
      if (event.keyCode && event.keyCode === 27 || event.key && event.key.toLowerCase() === 'escape') {
        Array.prototype.forEach.call(modals, modal => modal.closeModal());
      }
    });
  }
};

export default initModals;
