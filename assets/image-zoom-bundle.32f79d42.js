"use strict";(self.webpackChunkeokoneyo_github_io=self.webpackChunkeokoneyo_github_io||[]).push([[618],{7544:function(t,e,i){i.r(e);i(1539),i(2419);var o=i(5671),n=i(3144),l=i(7326),a=i(9340),g=i(6215),c=i(1120),m=i(4942),r=(i(2222),i(5091)),u=i(6010),s=i(1841);function d(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}();return function(){var i,o=(0,c.Z)(t);if(e){var n=(0,c.Z)(this).constructor;i=Reflect.construct(o,arguments,n)}else i=o.apply(this,arguments);return(0,g.Z)(this,i)}}var h=function(t){(0,a.Z)(i,t);var e=d(i);function i(t){var n,a;return(0,o.Z)(this,i),a=e.call(this,t),(0,m.Z)((0,l.Z)(a),"input",void 0),(0,m.Z)((0,l.Z)(a),"lightbox",void 0),(0,m.Z)((0,l.Z)(a),"animate",void 0),(0,m.Z)((0,l.Z)(a),"lightBoxId",void 0),(0,m.Z)((0,l.Z)(a),"imgEnlg",void 0),(0,m.Z)((0,l.Z)(a),"imgPreview",void 0),(0,m.Z)((0,l.Z)(a),"animationSupported",!!window.requestAnimationFrame&&!s.WR()),(0,m.Z)((0,l.Z)(a),"toggleFullWidth",(function(t){a.animationSupported&&a.animate?window.requestAnimationFrame((function(){a.animateZoomImage(t)})):s.og(a.lightbox,"image-zoom__lightbox--is-visible",t)})),(0,m.Z)((0,l.Z)(a),"animateZoomImage",(function(t){var e,i,o=a.imgPreview.getBoundingClientRect(),n=a.lightbox.getBoundingClientRect().width,l=t?[o.top,o.left,o.width]:[0,0,n],g=t?[-o.top,-o.left,parseFloat(String(n/o.width))]:[o.top+a.lightbox.scrollTop,o.left,parseFloat(String(o.width/n))];t&&(null===(i=a.imgEnlg)||void 0===i||i.setAttribute("style","top: ".concat(l[0],"px; left:").concat(l[1],"px; width:").concat(l[2],"px;")));s.IV(a.lightbox,"image-zoom__lightbox--no-transition"),s.cn(a.lightbox,"image-zoom__lightbox--is-visible"),null===(e=a.imgEnlg)||void 0===e||e.addEventListener("transitionend",(function(){var e;t||s.IV(a.lightbox,"image-zoom__lightbox--is-visible"),s.cn(a.lightbox,"image-zoom__lightbox--no-transition"),null===(e=a.imgEnlg)||void 0===e||e.removeAttribute("style")}),{once:!0}),a.imgEnlg.style.transform="translateX(".concat(g[1],"px) translateY(").concat(g[0],"px) scale(").concat(g[2],")"),s.og(a.lightbox,"image-zoom__lightbox--animate-bg",t)})),a.lightBoxId="img-zoom-lightbox--".concat(a.options.key),a.imgPreview=a.element.getElementsByClassName("js-image-zoom__preview")[0],a.initImageZoomHtml(),a.lightbox=document.getElementById(a.lightBoxId),a.imgEnlg=null===(n=a.lightbox)||void 0===n?void 0:n.getElementsByClassName("js-image-zoom__fw")[0],a.input=a.element.getElementsByClassName("js-image-zoom__input")[0],a.animate="off"!==a.element.getAttribute("data-morph"),a}return(0,n.Z)(i,[{key:"initImageZoomHtml",value:function(){var t=this.element.getAttribute("data-img");t||(t=this.imgPreview.getAttribute("src"));var e=document.createElement("div");s.KT(e,{class:(0,u.Z)("image-zoom__lightbox","js-image-zoom__lightbox"),id:this.lightBoxId,"aria-hidden":"true"}),e.innerHTML='<img src="'.concat(t,'" class="js-image-zoom__fw"/>'),document.body.appendChild(e);var i='<input aria-hidden="true" type="checkbox" class='.concat((0,u.Z)("image-zoom__input","js-image-zoom__input"),"/>");this.element.insertAdjacentHTML("afterbegin",i)}},{key:"initImageZoomEvents",value:function(){var t,e=this;this.imgPreview.addEventListener("click",(function(){e.toggleFullWidth(!0),e.input.checked=!0})),null===(t=this.lightbox)||void 0===t||t.addEventListener("click",(function(){e.toggleFullWidth(!1),e.input.checked=!1})),this.input.addEventListener("change",(function(){e.toggleFullWidth(e.input.checked)})),this.input.addEventListener("keydown",(function(t){(t.keyCode&&13===t.keyCode||t.key&&"enter"===t.key.toLowerCase())&&(e.input.checked=!e.input.checked,e.toggleFullWidth(e.input.checked))}))}},{key:"mount",value:function(){this.initImageZoomEvents()}}],[{key:"shouldToggle",value:function(t){s.pv(t.lightbox,"image-zoom__lightbox--is-visible")&&t.toggleFullWidth(!1)}}]),i}(r.Component);e.default=h}}]);