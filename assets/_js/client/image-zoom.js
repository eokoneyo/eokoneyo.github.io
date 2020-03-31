import * as Util from '../utils';

/**
 * @module imageZoom
 * @link https://codyhouse.co/ds/components/app/image-zoom
 */
class ImageZoom {
  /** @lends ImageZoom.prototype */
  constructor(element) {
    this.element = element;
    this.imgPreview = this.element.getElementsByClassName('js-image-zoom__preview')[0];

    this.initImageZoomHtml(); // init markup

    this.lightbox = this.element.getElementsByClassName('js-image-zoom__lightbox')[0];
    this.imgEnlg = this.lightbox.getElementsByClassName('js-image-zoom__fw')[0];
    this.input = this.element.getElementsByClassName('js-image-zoom__input')[0];
    this.animationSupported = window.requestAnimationFrame && !Util.osHasReducedMotion();
    this.animate = this.element.getAttribute('data-morph') !== 'off';

    this.initImageZoomEvents(); // init events
  }

  initImageZoomHtml(){
    // get zoomed image url
    let url = this.element.getAttribute('data-img');
    if(!url) url = this.imgPreview.getAttribute('src');

    const newHtml = `
        <div class="image-zoom__lightbox js-image-zoom__lightbox" aria-hidden="true">
            <img src="${url}" class="js-image-zoom__fw"/>
        </div>
        <input aria-hidden="true" type="checkbox" class="image-zoom__input js-image-zoom__input"/>
    `;
    this.element.insertAdjacentHTML('afterbegin', newHtml);
  };

  animateZoomImage(bool) {
    // get img preview position and dimension for the morphing effect
    const rect = this.imgPreview.getBoundingClientRect();
    const finalWidth = this.lightbox.getBoundingClientRect().width;
    const init = (bool) ? [rect.top, rect.left, rect.width] : [0, 0, finalWidth];
    const final = (bool) ? [-rect.top, -rect.left, parseFloat(finalWidth/rect.width)] : [rect.top + this.lightbox.scrollTop, rect.left, parseFloat(rect.width/finalWidth)];

    if(bool) {
      this.imgEnlg.setAttribute('style', `top: ${init[0]}px; left:${init[1]}px; width:${init[2]}px;`);
    }

    // show modal
    Util.removeClass(this.lightbox, 'image-zoom__lightbox--no-transition');
    Util.addClass(this.lightbox, 'image-zoom__lightbox--is-visible');

    this.imgEnlg.addEventListener('transitionend', function cb(event){ // reset elements once animation is over
      if(!bool) Util.removeClass(this.lightbox, 'image-zoom__lightbox--is-visible');
      Util.addClass(this.lightbox, 'image-zoom__lightbox--no-transition');
      this.imgEnlg.removeAttribute('style');
      this.imgEnlg.removeEventListener('transitionend', cb);
    });

    // animate image and bg
    this.imgEnlg.style.transform = `translateX(${final[1]}px) translateY(${final[0]}px) scale(${final[2]})`;
    Util.toggleClass(this.lightbox, 'image-zoom__lightbox--animate-bg', bool);
  };

  toggleFullWidth(bool) {
    if(this.animationSupported && this.animate) { // start expanding animation
      window.requestAnimationFrame(function(){
        this.animateZoomImage(bool);
      });
    } else { // show lightbox without animation
      Util.toggleClass(this.lightbox, 'image-zoom__lightbox--is-visible', bool);
    }
  };

  initImageZoomEvents() {
    // toggle lightbox on click
    this.imgPreview.addEventListener('click', () => {
      this.toggleFullWidth(true);
      this.input.checked = true;
    });

    this.lightbox.addEventListener('click', () =>{
      this.toggleFullWidth(false);
      this.input.checked = false;
    });

    // keyboard accessibility
    this.input.addEventListener('change', () =>{
      this.toggleFullWidth(this.input.checked);
    });

    this.input.addEventListener('keydown', (event) =>{
      if( (event.keyCode && event.keyCode === 13) || (event.key && event.key.toLowerCase() === 'enter') ) {
        this.input.checked = !this.input.checked;
        this.toggleFullWidth(this.input.checked);
      }
    });
  };
}


/**
 *
 * @param {Window} global
 */
const registerImageZoom = (global) => {
  const { document } = global;

  // init ImageZoom object
  const imageZoom = document.getElementsByClassName('js-image-zoom');

  if(imageZoom.length > 0) {
    const imageZoomArray = [];

    Array.prototype.forEach.call(imageZoom, (_, idx) => {
      imageZoomArray.push(new ImageZoom(imageZoom[idx]));
    });

    // close Zoom Image lightbox on Esc
    window.addEventListener('keydown', (event) => {
      if((event.keyCode && event.keyCode === 27) || (event.key && event.key.toLowerCase() === 'esc')) {
        Array.prototype.forEach.call(imageZoomArray, (imageZoomItem) => {
          imageZoomItem.input.checked = false;
          if(Util.hasClass(imageZoomItem.lightbox, 'image-zoom__lightbox--is-visible')) {
            imageZoomItem.toggleFullWidth(false);
          }
        });
      }
    });
  }
};

export default registerImageZoom;
