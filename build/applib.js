(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
  Tries to get an array of table header (TH) contents from a given table. If
  there are no TH elements in the table, an empty array is returned.
  @param {!Element} element Table or blob of HTML containing a table?
  @param {?string} pageTitle
  @return {!Array<string>}
*/
var getTableHeader = function getTableHeader(element, pageTitle) {
  var thArray = [];

  if (element.children === undefined || element.children === null) {
    return thArray;
  }

  for (var i = 0; i < element.children.length; i++) {
    var el = element.children[i];

    if (el.tagName === 'TH') {
      // ok, we have a TH element!
      // However, if it contains more than two links, then ignore it, because
      // it will probably appear weird when rendered as plain text.
      var aNodes = el.querySelectorAll('a');
      if (aNodes.length < 3) {
        // todo: remove nonstandard Element.innerText usage
        // Also ignore it if it's identical to the page title.
        if ((el.innerText && el.innerText.length || el.textContent.length) > 0 && el.innerText !== pageTitle && el.textContent !== pageTitle && el.innerHTML !== pageTitle) {
          thArray.push(el.innerText || el.textContent);
        }
      }
    }

    // if it's a table within a table, don't worry about it
    if (el.tagName === 'TABLE') {
      continue;
    }

    // recurse into children of this element
    var ret = getTableHeader(el, pageTitle);

    // did we get a list of TH from this child?
    if (ret.length > 0) {
      thArray = thArray.concat(ret);
    }
  }

  return thArray;
};

exports.default = {
  getTableHeader: getTableHeader
};

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _CollapseElement = require('../src/CollapseElement');

var _CollapseElement2 = _interopRequireDefault(_CollapseElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  CollapseElement: _CollapseElement2.default
};

},{"../src/CollapseElement":1}]},{},[2]);
