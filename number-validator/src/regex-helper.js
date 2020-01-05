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

export { RegexHelper }
