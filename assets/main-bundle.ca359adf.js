(self.webpackChunkeokoneyo_github_io=self.webpackChunkeokoneyo_github_io||[]).push([[179],{9304:function(e,t,n){"use strict";n(9554),n(1539),n(8674),n(4747);var r=n(5091),a=(n(7042),n(2564),n(6030)),o=n(8620),i={path:null,shape:null,preloader:null},c=function(e){var t,n,r,c,s="eoe_has_seen_preloader",u="data-preloader-displayed",l=e.document;i.preloader=l.querySelector(".preloader"),i.shape=null!==(t=null===(n=i.preloader)||void 0===n?void 0:n.querySelector("svg.shape"))&&void 0!==t?t:null,i.path=null!==(r=null===(c=i.shape)||void 0===c?void 0:c.querySelector("path"))&&void 0!==r?r:null;var d;"true"===(0,o.Do)(s)?(null===(d=i.preloader)||void 0===d||d.setAttribute("style","display: none"),l.body.style.overflow="auto",l.body.setAttribute(u,String(!0))):setTimeout((function(){return e=2e3,void a.Z.timeline({duration:e}).add({targets:Array.prototype.slice.call(null===(t=i.preloader)||void 0===t||null===(n=t.querySelector(".content-wrapper"))||void 0===n?void 0:n.children,0),opacity:"0",easing:"easeInOutExpo"},0).add({delay:1e3,targets:i.preloader,easing:"easeInOutSine",translateY:"-200vh"},0).add({delay:1e3,targets:i.path,easing:"easeOutQuad",d:null===(r=i.path)||void 0===r?void 0:r.getAttribute("pathdata:id"),complete:function(){l.body.style.overflow="auto",l.body.setAttribute(u,String(!0)),(0,o.d8)(s,String(!0))}},0);var e,t,n,r}),500)},s=n(3038),u=n.n(s),l=n(4575),d=n.n(l),h=n(3913),f=n.n(h),v=n(1506),p=n.n(v),m=n(2205),g=n.n(m),y=n(8585),S=n.n(y),C=n(9754),R=n.n(C),b=n(9713),w=n.n(b),k=n(3096),L=n.n(k),E="search:ui:open",_="search:ui:close";function A(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=R()(e);if(t){var a=R()(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return S()(this,n)}}var I=function(e){g()(n,e);var t=A(n);function n(e){var r;return d()(this,n),r=t.call(this,e),w()(p()(r),"headerSearchActive",(function(){return r.element.hasAttribute("search-expanded")})),w()(p()(r),"setHeaderSearchActive",(function(){return r.element.setAttribute("search-expanded","")})),w()(p()(r),"setHeaderSearchDisabled",(function(){return r.element.removeAttribute("search-expanded")})),w()(p()(r),"animateLandingPageHeader",(function(){var e="ns-header--hidden",t="ns-header--scrolled",n=document.querySelector(".ns-landing-screen"),a=null==n?void 0:n.querySelector(".main-content");n||document.addEventListener("scroll",L()((function(){var e=(0,o.pv)(r.element,t),n=window.scrollY;requestAnimationFrame((function(){e&&n<50&&(0,o.og)(r.element,t,!1),!e&&n>50&&(0,o.og)(r.element,t,!0)}))}),250)),n&&n.addEventListener("scroll",L()((function(){var n=a.getBoundingClientRect(),i=(0,o.pv)(r.element,e),c=(0,o.pv)(r.element,t);requestAnimationFrame((function(){i&&n.y<10&&(0,o.og)(r.element,e,!1),!i&&n.y>10&&(r.headerSearchActive()&&r.setHeaderSearchDisabled(),(0,o.og)(r.element,e,!0)),c&&n.y>10&&(0,o.og)(r.element,t,!1),!c&&n.y<10&&(0,o.og)(r.element,t,!0)}))}),250))})),r.ref={},r}return f()(n,[{key:"mount",value:function(){var e,t=this,n=null===(e=this.ref)||void 0===e?void 0:e.mobileMenuToggle,a=u()(n,1)[0];this.animateLandingPageHeader(),r.eventbus.on(_,(function(){return t.headerSearchActive()?t.setHeaderSearchDisabled():null})),r.eventbus.on(E,(function(){return t.headerSearchActive()?null:t.setHeaderSearchActive()})),null==a||a.addEventListener("click",(function(){var e="mobile-toggle--open";(0,o.og)(a,e,!(0,o.pv)(a,e))}))}}]),n}(r.Component),x=(n(2222),n(5827),n(3007));function D(e){var t=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,r=R()(e);if(t){var a=R()(this).constructor;n=Reflect.construct(r,arguments,a)}else n=r.apply(this,arguments);return S()(this,n)}}var q=function(e){g()(n,e);var t=D(n);function n(e){var r;return d()(this,n),r=t.call(this,e),w()(p()(r),"loadingIndicator",void 0),w()(p()(r),"searchRequest",(function(e){return(0,o.ZE)({command:"search:request",key:e})})),w()(p()(r),"renderSearchResultItem",(function(e){return'\n      <a href="'.concat(e.url,'" class="search__results__item">\n         <p class="search__results__item__title">').concat(e.title,'</p>\n         <p class="search__results__item__category endnote_ts">').concat(e.category,"</p>\n      </a>\n    ")})),w()(p()(r),"insertContentInSearchContainer",(function(e){var t=u()(r.ref.searchResultContainer,1)[0];t.firstChild?t.replaceChild(e,t.firstChild):t.appendChild(e)})),w()(p()(r),"displaySearchError",(function(e){x.Z.warn(e)})),w()(p()(r),"displayNoResultFound",(function(){var e=document.createElement("div");e.className="container loading-indicator js-loading-indicator",e.textContent="no results for the term ".concat(r.state.searchText),r.insertContentInSearchContainer(e)})),w()(p()(r),"handleSearch",L()((function(e){e.preventDefault();var t=e.target.value;t&&(r.setState({done:!1,searchText:t,searchResultLoading:!0}),r.searchRequest(t).then((function(e){var t=e.data;return r.setState({done:!0,searchResult:t,searchResultLoading:!1})})).catch(r.displaySearchError))}),250)),r.ref={},r}return f()(n,[{key:"setLoadingIndicator",value:function(){var e=u()(this.ref.searchResultContainer,1)[0],t=document.createElement("div");t.className="container loading-indicator js-loading-indicator",t.textContent="searching matches for ".concat(this.state.searchText,"..."),this.insertContentInSearchContainer(t),this.loadingIndicator=e.querySelector(".js-loading-indicator")}},{key:"displaySearchResult",value:function(e){var t=this,n=document.createDocumentFragment(),r=document.createElement("ul");r.className="container js-search-result-list search-result-list",e.reduce((function(e,n){var r=document.createElement("li");return r.innerHTML=t.renderSearchResultItem(n),e.appendChild(r),e}),r),n.appendChild(r),this.insertContentInSearchContainer(n)}},{key:"stateChange",value:function(e){"searchResultLoading"in e&&Boolean(e.searchResultLoading)&&this.setLoadingIndicator(),e.searchResult&&this.displaySearchResult(e.searchResult),e.done&&!e.searchResult&&this.displayNoResultFound()}},{key:"mount",value:function(){var e=u()(this.ref.searchForm,1)[0],t=u()(this.ref.searchResultContainer,1)[0],n=e.elements.namedItem("searchInput");e.addEventListener("click",(function(){return r.eventbus.emit(E)})),document.addEventListener("click",(function(n){e.contains(null==n?void 0:n.target)||(r.eventbus.emit(_),t.textContent="")})),e.addEventListener("submit",this.handleSearch),n.addEventListener("input",this.handleSearch)}}]),n}(r.Component);!function(e){var t=e.document;t.addEventListener("DOMContentLoaded",(function(){c(e),(0,r.loadComponents)({NavigationComponent:I,SearchComponent:q});var a=t.querySelector("#Playlists"),o=t.getElementsByClassName("js-image-zoom");o.length>0&&n.e(618).then(n.bind(n,7544)).then((function(t){var n=t.default,a=[];Array.prototype.forEach.call(o,(function(e,t){var o=(0,r.createInstance)(e,"imagezoom-".concat(t),n,{key:t});o._load(),a.push(o)})),e.addEventListener("keydown",(function(e){(e.keyCode&&27===e.keyCode||e.key&&"esc"===e.key.toLowerCase())&&a.forEach((function(e){e.input.removeAttribute("checked"),n.shouldToggle(e)}))}))})),a&&Promise.all([n.e(692),n.e(449)]).then(n.bind(n,1550)).then((function(e){var t=e.default;(0,r.createInstance)(a,"Playlists",t)._load()})),e.ga&&e.ga("send",{hitType:"pageview",page:e.location.pathname})}))}(window)},8620:function(e,t,n){"use strict";n.d(t,{pv:function(){return o},KT:function(){return i},cn:function(){return c},IV:function(){return s},og:function(){return u},WR:function(){return l},d8:function(){return d},Do:function(){return h},ZE:function(){return f}});n(2222),n(9554),n(2772),n(9600),n(7042),n(5003),n(7941),n(1539),n(8674),n(4603),n(4916),n(9714),n(4723),n(5306),n(3123),n(4747);var r=n(3038),a=n.n(r),o=function(e,t){return e.classList?e.classList.contains(t):!!e.className.match(new RegExp("(\\s|^)".concat(t,"(\\s|$)")))},i=function(e,t){Object.keys(t).forEach((function(n){return e.setAttribute(n,t[n])}))},c=function e(t,n){var r=n.split(" ");t.classList?t.classList.add(r[0]):o(t,r[0])||i(t,{class:"".concat(t.className," ").concat(r[0])}),r.length>1&&e(t,r.slice(1).join(" "))},s=function e(t,n){var r=n.split(" ");if(t.classList)t.classList.remove(r[0]);else if(o(t,r[0])){var a=new RegExp("(\\s|^)".concat(r[0],"(\\s|$)"));i(t,{class:t.className.replace(a," ")})}r.length>1&&e(t,r.slice(1).join(" "))},u=function(e,t,n){return n?c(e,t):s(e,t)},l=function(){if(!window.matchMedia)return!1;var e=window.matchMedia("(prefers-reduced-motion: reduce)");return!!e&&e.matches},d=function(e,t){var n,r=Object.getOwnPropertyDescriptor(window.Document.prototype,"cookie")||Object.getOwnPropertyDescriptor(window.HTMLDocument.prototype,"cookie");null==r||null===(n=r.set)||void 0===n||n.call(document,"".concat(e,"=").concat(t))},h=function(e){var t=String(document.cookie);if(t.indexOf(e)<0)return null;var n=new RegExp("".concat(e,"=(\\w*);?")),r=t.match(n);return a()(r,2)[1]},f=function(e){return new Promise((function(t,n){if(!navigator.serviceWorker||!navigator.serviceWorker.controller)return n(new Error("no service worker!!"));var r=new MessageChannel;r.port1.onmessage=function(e){return e.data.error?n(e.data.error):t(e.data)},navigator.serviceWorker.controller.postMessage(e,[r.port2])}))}},3007:function(e,t,n){"use strict";var r,a=n(6482),o=n.n(a);t.Z=(r||(r=o()("eoe")),r)},8879:function(){}},0,[[9304,666,216],[8879,666,216]]]);