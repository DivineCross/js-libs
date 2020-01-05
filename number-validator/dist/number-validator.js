/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// CONCATENATED MODULE: ./src/regex-helper.js
class RegexHelper {
    static wrap(expr = '') {
        return `(?:${expr})`;
    }

    static or(...exprs) {
        return RegexHelper.wrap(exprs.join('|'));
    }

    static range(n = 0, m) {
        const mPart = m === void 0 ? '' : (',' + (m === Infinity ? '' : m));
        return `{${n}${mPart}}`;
    }

    static group(characters = '') {
        return `[${characters}]`;
    }

    static negGroup(characters = '') {
        return `[^${characters}]`;
    }

    static whole(expr = '') {
        return `^${expr}$`;
    }
}



// CONCATENATED MODULE: ./src/number-validator.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return number_validator_NumberValidator; });


const number_validator_NumberValidator = (() => {
    const formatRegex = /^([-+])?(\d+)?(\.)?(\d+)?$/;

    const defaults = {
        maxIntegerDigits: 20,
        maxFractionDigits: 8,
        maxDigits: 28,
    };

    const cache = new Map;

    class NumberValidator {
        constructor(format = '') {
            const matches = format.match(formatRegex);
            if (matches === null)
                throw new Error('The correct format is ' + formatRegex + '.');

            const sign = matches[1];
            const allowPositive = sign !== '-';
            const allowNegative = !sign || sign === '-';
            const maxIntegerDigits = Number(matches[2] || defaults.maxIntegerDigits);
            const allowFraction = !!matches[3];
            const maxFractionDigits = allowFraction ? Number(matches[4] || defaults.maxFractionDigits) : 0;
            const maxLength = maxIntegerDigits + maxFractionDigits + Number(allowNegative) + Number(allowFraction);
            if (maxIntegerDigits + maxFractionDigits > defaults.maxDigits)
                throw new Error(`Numbers consist of ${defaults.maxDigits} or above digits are not supported.`);

            const integerExpr = (() => {
                const maxDigits = Math.max(0, maxIntegerDigits);
                const oneDigit = '\\d';
                const digitsRange = RegexHelper.wrap('[1-9]\\d' + RegexHelper.range(0, maxDigits - 1));

                return (
                    maxDigits === 0 ? '' :
                    maxDigits === 1 ? oneDigit :
                    RegexHelper.or(digitsRange, oneDigit));
            })();

            const fractionExpr = (() => {
                const maxDigits = Math.max(0, maxFractionDigits);

                return RegexHelper.wrap('\\d' + RegexHelper.range(0, maxDigits));
            })();

            const numberExpr = (() => {
                const sign = '-' + (allowPositive ? '?' : '') + '(?!$)';
                const fraction = '\\.(?!$)' + fractionExpr;

                const integer = integerExpr;
                const signedInteger = !allowNegative ? integer : RegexHelper.wrap(sign + integer);
                const signedIntegerDot = RegexHelper.wrap(signedInteger + (allowFraction ? '\\.?' : ''));
                const signedIntegerEmpty = RegexHelper.or(signedInteger, RegexHelper.wrap(sign));
                const floating = signedIntegerEmpty + fraction;

                return (integer ? RegexHelper.or(signedIntegerDot, floating) : floating);
            })();

            const filterExpr = (() => {
                return RegexHelper.negGroup('\\d' + (allowNegative ? '\\-' : '') + (allowFraction ? '\\.' : ''));
            })();

            Object.defineProperties(this, {
                allowPositive: { value: allowPositive },
                allowNegative: { value: allowNegative },
                allowFraction: { value: allowFraction },
                maxIntegerDigits: { value: maxIntegerDigits },
                maxFractionDigits: { value: maxFractionDigits },
                maxLength: { value: maxLength },
                integerExpr: { value: integerExpr },
                fractionExpr: { value: fractionExpr },
                numberExpr: { value: numberExpr },
                filterExpr: { value: filterExpr },
                numberRegex: { value: new RegExp(RegexHelper.whole(numberExpr)) },
                filterRegex: { value: new RegExp(filterExpr, 'g') },
            });
        }
    }

    return new Proxy(NumberValidator, {
        apply(target, thisArg, args) {
            const format = args[0];
            const instance = cache.get(format);

            if (instance)
                return instance;

            const newInstance = new NumberValidator(format);
            cache.set(format, newInstance);

            return newInstance;
        },
    });
})();




/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var _number_validator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


global['NumberValidator'] = _number_validator__WEBPACK_IMPORTED_MODULE_0__[/* NumberValidator */ "a"];

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(2)))

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })
/******/ ]);