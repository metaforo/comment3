const {override, adjustStyleLoaders} = require('customize-cra');
module.exports = override((config) => {
    config.optimization.splitChunks = {
        cacheGroups: {
            default: false,
        },
    };
// Move runtime into bundle instead of separate file
//     config.optimization.runtimeChunk = false;
//     config.optimization.minimize = false;

    // JS
    // config.output.filename = 'metaforo-sdk.min.js';

    // // CSS. "5" is MiniCssPlugin
    // config.plugins[5].options.filename = '[name].min.css';
    // config.plugins[5].options.publicPath = '../';

    return config;
}, adjustStyleLoaders(({use}) => {
    use.forEach((loader) => {
        if (/mini-css-extract-plugin/.test(loader.loader)) {
            loader.loader = require.resolve('style-loader');
            loader.options = {};
        }
    });
}));
