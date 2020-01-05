const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/global.js',
    output: {
        filename: 'number-validator.js',
        path: path.resolve(__dirname, 'dist'),
    },
    target: 'web',
    optimization: {
        minimize: false,
    },
};
