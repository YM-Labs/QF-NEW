'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

exports.__esModule = true;
exports.onRouteUpdate = void 0;

var _extends2 = _interopRequireDefault(require('@babel/runtime/helpers/extends'));

// Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
(function(arr) {
	arr.forEach(function(item) {
		if (item.hasOwnProperty('prepend')) {
			return;
		}

		Object.defineProperty(item, 'prepend', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function prepend() {
				var argArr = Array.prototype.slice.call(arguments),
					docFrag = document.createDocumentFragment();
				argArr.forEach(function(argItem) {
					var isNode = argItem instanceof Node;
					docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
				});
				this.insertBefore(docFrag, this.firstChild);
			}
		});
	});
})([Element.prototype, Document.prototype, DocumentFragment.prototype]); // Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/append()/append().md

(function(arr) {
	arr.forEach(function(item) {
		if (item.hasOwnProperty('append')) {
			return;
		}

		Object.defineProperty(item, 'append', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function append() {
				var argArr = Array.prototype.slice.call(arguments),
					docFrag = document.createDocumentFragment();
				argArr.forEach(function(argItem) {
					var isNode = argItem instanceof Node;
					docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
				});
				this.appendChild(docFrag);
			}
		});
	});
})([Element.prototype, Document.prototype, DocumentFragment.prototype]); // from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md

(function(arr) {
	arr.forEach(function(item) {
		if (item.hasOwnProperty('remove')) {
			return;
		}

		Object.defineProperty(item, 'remove', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function remove() {
				if (this.parentNode === null) {
					return;
				}

				this.parentNode.removeChild(this);
			}
		});
	});
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

var defaultOptions = {
	includePaths: [],
	excludePaths: [],
	height: 3,
	prependToBody: false,
	color: '#e14524'
}; // browser API usage: https://www.gatsbyjs.org/docs/browser-apis/#onRouteUpdate

var onRouteUpdate = function onRouteUpdate(_ref, pluginOptions) {
	var pathname = _ref.location.pathname;

	if (pluginOptions === void 0) {
		pluginOptions = {};
	}

	// merge default options with user defined options in `gatsby-config.js`
	var options = (0, _extends2.default)({}, defaultOptions, {}, pluginOptions);
	var includePaths = options.includePaths,
		excludePaths = options.excludePaths,
		prependToBody = options.prependToBody,
		color = options.color;  // eslint-disable-line no-unused-vars

	function pageProgress() {
		let darkMode = localStorage.getItem('darkMode');
		// create progress indicator container and append/prepend to document body
		var dir;
		if (window.location.href.indexOf('/ar/') !== -1) {
			dir = 'right: 0;';
		} else {
			dir = 'left: 0;';
		}
		var container = document.createElement('div');
		container.className = 'progress-container'; // eslint-disable-next-line
        container.id = 'progress-container';

        var node = document.createElement('div');
		node.id = 'gatsby-plugin-page-progress'; // eslint-disable-next-line

        container.append(node)

		prependToBody ? document.body.prepend(container) : document.body.append(container);

		if (darkMode !== 'true') {
			color = '#e14524';
			localStorage.setItem('progressBarColor', '#e14524');
		} else {
			localStorage.setItem('progressBarColor', '#6BCDB2');
		}

		var scrolling = false;
		var indicator = document.getElementById('gatsby-plugin-page-progress'); // determine width of progress indicator

		var getIndicatorPercentageWidth = function getIndicatorPercentageWidth(currentPos, totalScroll) {
			return (currentPos / totalScroll) * 100;
		}; // find the total height of window

		var getScrollHeight = function getScrollHeight() {
			// https://javascript.info/size-and-scroll-window#width-height-of-the-document
			return Math.max(
				document.body.scrollHeight,
				document.documentElement.scrollHeight,
				document.body.offsetHeight,
				document.documentElement.offsetHeight,
				document.body.clientHeight,
				document.documentElement.clientHeight
			);
		}; // add throttled listener to update on scroll

		window.addEventListener('scroll', function() {
			var currentPos = window.scrollY;
			var _window = window,
				innerHeight = _window.innerHeight;
			var scrollHeight = getScrollHeight();
			var scrollDistance = scrollHeight - innerHeight;
			if (!scrolling) {
				window.requestAnimationFrame(function() {
					var indicatorWidth = getIndicatorPercentageWidth(currentPos, scrollDistance);
					indicator.setAttribute(
						'style', // eslint-disable-next-line
						'width: ' + indicatorWidth + '%; position: fixed; height: ' + 3 + 'px; background-color: ' + localStorage.getItem('progressBarColor') + '; top: 0; ' + dir + ' z-index: 1;'
					);
					scrolling = false;
				});
				scrolling = true;
			}
		});
	}

	function checkPaths(val, paths) {
		if (paths.length === 0) return val; // return if no paths

		var returnVal = val; // loop over each path

		paths.forEach(function(x) {
			// if returnVal has already changed => return
			if (returnVal === !val) return; // regex is supplied in an object: { regex: '/beep/beep/lettuce' }

			var isRegex = typeof x === 'object'; // if regex is present test it against the pathname - if test passes, change returnVal

			if (isRegex && new RegExp(x.regex, 'gm').test(pathname)) returnVal = !returnVal; // otherwise if the current path is strictly equal to the pathname, change returnVal

			if (x === pathname) returnVal = !returnVal;
		});
		return returnVal;
	} // check to see if the scroll indicator already exists - if it does, remove it

	function removeProgressIndicator() {
		var indicatorCheck = document.getElementById('progress-container');
		if (indicatorCheck) indicatorCheck.remove();
	} // if there's no excluded paths && no included paths

	if (!excludePaths.length && !includePaths.length) {
		removeProgressIndicator();
		pageProgress(); // if there's excluded paths && no included paths
	} else if (excludePaths.length && !includePaths.length) {
		var continueAfterExclude = checkPaths(true, excludePaths);
		removeProgressIndicator();
		if (continueAfterExclude) pageProgress(); // if there's either excluded paths && included paths || no excluded paths && included paths
	} else {
		var _continueAfterExclude = checkPaths(true, excludePaths);

		removeProgressIndicator();

		if (_continueAfterExclude) {
			var match = checkPaths(false, includePaths);
			match && pageProgress();
		}
	}
};

exports.onRouteUpdate = onRouteUpdate;