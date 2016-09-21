(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.xcase = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/es5/index.js":[function(require,module,exports){
'use strict';

var algorithms = {};

function isLower(char) {
  return char >= 0x61 /* 'a' */ && char <= 0x7a /* 'z' */;
}

function isUpper(char) {
  return char >= 0x41 /* 'A' */ && char <= 0x5a /* 'Z' */;
}

function isDigit(char) {
  return char >= 0x30 /* '0' */ && char <= 0x39 /* '9' */;
}

function toUpper(char) {
  return char - 0x20;
}

function toUpperSafe(char) {
  if (isLower(char)) {
    return char - 0x20;
  }
  return char;
}

function toLower(char) {
  return char + 0x20;
}

algorithms.camelize = function (str) {
  var firstChar = str.charCodeAt(0);
  if (isDigit(firstChar) || firstChar == 0x2d /* '-' */) {
      return str;
    }
  var out = [];
  var changed = false;
  if (isUpper(firstChar)) {
    changed = true;
    out.push(toLower(firstChar));
  } else {
    out.push(firstChar);
  }

  var length = str.length;
  for (var i = 1; i < length; ++i) {
    var c = str.charCodeAt(i);
    if (c === 0x5f /* '_' */ || c === 0x20 /* ' ' */ || c == 0x2d /* '-' */) {
        changed = true;
        c = str.charCodeAt(++i);
        if (isNaN(c)) {
          return str;
        }
        out.push(toUpperSafe(c));
      } else {
      out.push(c);
    }
  }
  return changed ? String.fromCharCode.apply(undefined, out) : str;
};

algorithms.decamelize = function (str, separator) {
  var firstChar = str.charCodeAt(0);
  var separatorChar = (separator || '_').charCodeAt(0);
  if (!isLower(firstChar)) {
    return str;
  }
  var length = str.length;
  var changed = false;
  var out = [];
  for (var i = 0; i < length; ++i) {
    var c = str.charCodeAt(i);
    if (isUpper(c)) {
      out.push(separatorChar);
      out.push(toLower(c));
      changed = true;
    } else {
      out.push(c);
    }
  }
  return changed ? String.fromCharCode.apply(undefined, out) : str;
};

algorithms.pascalize = function (str) {
  var firstChar = str.charCodeAt(0);
  if (isDigit(firstChar) || firstChar == 0x2d /* '-' */) {
      return str;
    }
  var length = str.length;
  var changed = false;
  var out = [];
  for (var i = 0; i < length; ++i) {
    var c = str.charCodeAt(i);
    if (c === 0x5f /* '_' */ || c === 0x20 /* ' ' */ || c == 0x2d /* '-' */) {
        changed = true;
        c = str.charCodeAt(++i);
        if (isNaN(c)) {
          return str;
        }
        out.push(toUpperSafe(c));
      } else if (i === 0 && isLower(c)) {
      changed = true;
      out.push(toUpper(c));
    } else {
      out.push(c);
    }
  }
  return changed ? String.fromCharCode.apply(undefined, out) : str;
};

algorithms.depascalize = function (str, separator) {
  var firstChar = str.charCodeAt(0);
  var separatorChar = (separator || '_').charCodeAt(0);
  if (!isUpper(firstChar)) {
    return str;
  }
  var length = str.length;
  var changed = false;
  var out = [];
  for (var i = 0; i < length; ++i) {
    var c = str.charCodeAt(i);
    if (isUpper(c)) {
      if (i > 0) {
        out.push(separatorChar);
      }
      out.push(toLower(c));
      changed = true;
    } else {
      out.push(c);
    }
  }
  return changed ? String.fromCharCode.apply(undefined, out) : str;
};

module.exports = require('./main')(algorithms);
},{"./main":1}],1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

module.exports = function (algorithms) {
  function shouldProcessValue(value) {
    return value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object' && !(value instanceof Date) && !(value instanceof Function);
  }

  function processKeys(obj, fun, opts) {
    var obj2 = void 0;
    if (obj instanceof Array) {
      obj2 = [];
    } else {
      if (typeof obj.prototype !== 'undefined') {
        // return non-plain object unchanged
        return obj;
      }
      obj2 = {};
    }
    for (var key in obj) {
      var value = obj[key];
      if (typeof key === 'string') key = fun(key, opts);
      if (shouldProcessValue(value)) {
        obj2[key] = processKeys(value, fun, opts);
      } else {
        obj2[key] = value;
      }
    }
    return obj2;
  }

  function processKeysInPlace(obj, fun, opts) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(obj)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        var value = obj[key];
        var newKey = fun(key, opts);
        if (newKey !== key) {
          delete obj[key];
        }
        if (shouldProcessValue(value)) {
          obj[newKey] = processKeys(value, fun, opts);
        } else {
          obj[newKey] = value;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return obj;
  }

  var iface = {
    camelize: algorithms.camelize,
    decamelize: function decamelize(str, opts) {
      return algorithms.decamelize(str, opts && opts.separator || '');
    },

    pascalize: algorithms.pascalize,
    depascalize: function depascalize(str, opts) {
      return algorithms.depascalize(str, opts && opts.separator || '');
    },
    camelizeKeys: function camelizeKeys(obj, opts) {
      opts = opts || {};
      if (!shouldProcessValue(obj)) return obj;
      if (opts.inPlace) return processKeysInPlace(obj, iface.camelize, opts);
      return processKeys(obj, iface.camelize, opts);
    },
    decamelizeKeys: function decamelizeKeys(obj, opts) {
      opts = opts || {};
      if (!shouldProcessValue(obj)) return obj;
      if (opts.inPlace) return processKeysInPlace(obj, iface.decamelize, opts);
      return processKeys(obj, iface.decamelize, opts);
    },
    pascalizeKeys: function pascalizeKeys(obj, opts) {
      opts = opts || {};
      if (!shouldProcessValue(obj)) return obj;
      if (opts.inPlace) return processKeysInPlace(obj, iface.pascalize, opts);
      return processKeys(obj, iface.pascalize, opts);
    },
    depascalizeKeys: function depascalizeKeys(obj, opts) {
      opts = opts || {};
      if (!shouldProcessValue(obj)) return obj;
      if (opts.inPlace) return processKeysInPlace(obj, iface.depascalize, opts);
      return processKeys(obj, iface.depascalize, opts);
    }
  };
  return iface;
};
},{}]},{},[])("/es5/index.js")
});