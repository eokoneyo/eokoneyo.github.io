import { Component } from 'gia';
import clsx from 'clsx';
import * as Util from './utils/dom';

/**
 * @module imageZoom
 * Adapted from https://codyhouse.co/ds/components/app/image-zoom
 */

class ImageZoomComponent extends Component {
  input: HTMLInputElement;

  lightbox: HTMLElement;

  private readonly animate: boolean;

  private readonly lightBoxId: string;

  private imgEnlg: HTMLElement;

  private imgPreview: HTMLElement;

  constructor(element: HTMLElement) {
    super(element);

    this.lightBoxId = `img-zoom-lightbox--${this.options.key}`;
    this.imgPreview = this.element.getElementsByClassName(
      'js-image-zoom__preview'
    )[0] as HTMLElement;

    this.initImageZoomHtml(); // init markup

    this.lightbox = document.getElementById(this.lightBoxId) as HTMLElement;
    this.imgEnlg = this.lightbox?.getElementsByClassName(
      'js-image-zoom__fw'
    )[0] as HTMLElement;
    this.input = this.element.getElementsByClassName(
      'js-image-zoom__input'
    )[0] as HTMLInputElement;

    this.animate = this.element.getAttribute('data-morph') !== 'off';
  }

  animationSupported =
    window.requestAnimationFrame && !Util.osHasReducedMotion();

  initImageZoomHtml(): void {
    // get zoomed image url
    let url = this.element.getAttribute('data-img');
    if (!url) url = this.imgPreview.getAttribute('src');

    const lightBox = document.createElement('div');
    Util.setAttributes(lightBox, {
      class: clsx('image-zoom__lightbox', 'js-image-zoom__lightbox'),
      id: this.lightBoxId,
      'aria-hidden': 'true',
    });
    lightBox.innerHTML = `<img src="${url}" class="js-image-zoom__fw"/>`;
    document.body.appendChild(lightBox);

    const keyboardInput = `<input aria-hidden="true" type="checkbox" class=${clsx(
      'image-zoom__input',
      'js-image-zoom__input'
    )}/>`;
    this.element.insertAdjacentHTML('afterbegin', keyboardInput);
  }

  toggleFullWidth = (bool: boolean): void => {
    if (this.animationSupported && this.animate) {
      // start expanding animation
      window.requestAnimationFrame(() => {
        this.animateZoomImage(bool);
      });
    } else {
      // show lightbox without animation
      Util.toggleClass(this.lightbox, 'image-zoom__lightbox--is-visible', bool);
    }
  };

  animateZoomImage = (bool: boolean): void => {
    // get img preview position and dimension for the morphing effect
    const rect = this.imgPreview.getBoundingClientRect();
    const finalWidth = this.lightbox.getBoundingClientRect().width;
    const init = bool ? [rect.top, rect.left, rect.width] : [0, 0, finalWidth];
    const final = bool
      ? [-rect.top, -rect.left, parseFloat(String(finalWidth / rect.width))]
      : [
          rect.top + this.lightbox.scrollTop,
          rect.left,
          parseFloat(String(rect.width / finalWidth)),
        ];

    if (bool) {
      this.imgEnlg?.setAttribute(
        'style',
        `top: ${init[0]}px; left:${init[1]}px; width:${init[2]}px;`
      );
    }

    // show modal
    Util.removeClass(this.lightbox, 'image-zoom__lightbox--no-transition');
    Util.addClass(this.lightbox, 'image-zoom__lightbox--is-visible');

    this.imgEnlg?.addEventListener(
      'transitionend',
      () => {
        // reset elements once animation is over
        if (!bool)
          Util.removeClass(this.lightbox, 'image-zoom__lightbox--is-visible');
        Util.addClass(this.lightbox, 'image-zoom__lightbox--no-transition');
        this.imgEnlg?.removeAttribute('style');
      },
      { once: true }
    );

    // animate image and bg
    // eslint-disable-next-line no-param-reassign
    this.imgEnlg.style.transform = `translateX(${final[1]}px) translateY(${final[0]}px) scale(${final[2]})`;
    Util.toggleClass(this.lightbox, 'image-zoom__lightbox--animate-bg', bool);
  };

  static shouldToggle(instance: InstanceType<typeof ImageZoomComponent>): void {
    if (Util.hasClass(instance.lightbox, 'image-zoom__lightbox--is-visible')) {
      instance.toggleFullWidth(false);
    }
  }

  initImageZoomEvents(): void {
    // toggle lightbox on click
    this.imgPreview.addEventListener('click', () => {
      this.toggleFullWidth(true);
      this.input.checked = true;
    });
    this.lightbox?.addEventListener('click', () => {
      this.toggleFullWidth(false);
      this.input.checked = false;
    });
    // keyboard accessibility
    this.input.addEventListener('change', () => {
      this.toggleFullWidth(this.input.checked);
    });
    this.input.addEventListener('keydown', (event) => {
      if (
        (event.keyCode && event.keyCode === 13) ||
        (event.key && event.key.toLowerCase() === 'enter')
      ) {
        this.input.checked = !this.input.checked;
        this.toggleFullWidth(this.input.checked);
      }
    });
  }

  mount(): void {
    this.initImageZoomEvents(); // init events
  }
}

export default ImageZoomComponent;
