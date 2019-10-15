'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

;(function (global) {

    var setCookie = function setCookie(name, value) {
        return global.document.cookie = name + '=' + value;
    };

    var getCookieValue = function getCookieValue(name) {
        var cookieString = String(global.document.cookie);

        if (cookieString.indexOf(name) < 0) return null;

        var searchRegex = new RegExp(name + '=(\\w*);?');

        var _cookieString$match = cookieString.match(searchRegex);

        var _cookieString$match2 = _slicedToArray(_cookieString$match, 2);

        var value = _cookieString$match2[1];

        return value;
    };

    document.addEventListener('DOMContentLoaded', function () {
        var ANIMATION_DURATION = 2000;
        var HAS_SEEN_PRELOADER_COOKIE = 'eoe_has_seen_preloader';
        var HTML_PRELOADER_ATTRIBUTE = 'data-preloader-displayed';

        var DOM = {};
        DOM.preloader = global.document.querySelector('.preloader');
        DOM.shape = DOM.preloader.querySelector('svg.shape');
        DOM.path = DOM.shape.querySelector('path');

        var removePreloader = function removePreloader(animationDuration) {
            anime({
                targets: DOM.preloader,
                duration: animationDuration,
                easing: 'easeInOutSine',
                translateY: '-200vh'
            });

            anime({
                targets: DOM.path,
                duration: animationDuration,
                easing: 'easeOutQuad',
                d: DOM.path.getAttribute('pathdata:id'),
                complete: function complete() {
                    global.document.body.style.overflow = 'auto';
                    global.document.body.setAttribute(HTML_PRELOADER_ATTRIBUTE, String(true));
                    // mark preloader as seen for the session
                    setCookie(HAS_SEEN_PRELOADER_COOKIE, true);
                }
            });
        };

        if (getCookieValue(HAS_SEEN_PRELOADER_COOKIE) === 'true') {
            DOM.preloader.style.display = 'none';
            global.document.body.style.overflow = 'auto';
            global.document.body.setAttribute(HTML_PRELOADER_ATTRIBUTE, String(true));
        } else {
            setTimeout(function () {
                return removePreloader(ANIMATION_DURATION);
            }, 1000);
        }

        //Do page view tracking
        if (global.ga) {
            global.ga('send', {
                hitType: 'pageview',
                page: global.location.pathname
            });
        }
    });
})(window);