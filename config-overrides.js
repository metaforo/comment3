module.exports = function override(config, env) {
    config.optimization.splitChunks = {
        cacheGroups: {
            default: false,
        },
    };

// Move runtime into bundle instead of separate file
//     config.optimization.runtimeChunk = false;
//     config.optimization.minimize = false;

// JS
    config.output.filename = '[name].min.js';
// CSS. "5" is MiniCssPlugin
    config.plugins[5].options.filename = '[name].min.css';
    config.plugins[5].options.publicPath = '../';

    return config;
}