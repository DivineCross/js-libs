import { RegexHelper as Rh } from './regex-helper'

const NumberValidator = (() => {
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
                const digitsRange = Rh.wrap('[1-9]\\d' + Rh.range(0, maxDigits - 1));

                return (
                    maxDigits === 0 ? '' :
                    maxDigits === 1 ? oneDigit :
                    Rh.or(digitsRange, oneDigit));
            })();

            const fractionExpr = (() => {
                const maxDigits = Math.max(0, maxFractionDigits);

                return Rh.wrap('\\d' + Rh.range(0, maxDigits));
            })();

            const numberExpr = (() => {
                const sign = '-' + (allowPositive ? '?' : '') + '(?!$)';
                const fraction = '\\.(?!$)' + fractionExpr;

                const integer = integerExpr;
                const signedInteger = !allowNegative ? integer : Rh.wrap(sign + integer);
                const signedIntegerDot = Rh.wrap(signedInteger + (allowFraction ? '\\.?' : ''));
                const signedIntegerEmpty = Rh.or(signedInteger, Rh.wrap(sign));
                const floating = signedIntegerEmpty + fraction;

                return (integer ? Rh.or(signedIntegerDot, floating) : floating);
            })();

            const filterExpr = (() => {
                return Rh.negGroup('\\d' + (allowNegative ? '\\-' : '') + (allowFraction ? '\\.' : ''));
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
                numberRegex: { value: new RegExp(Rh.whole(numberExpr)) },
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

export { NumberValidator };
