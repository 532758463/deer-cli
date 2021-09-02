const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');
const { getWebpackOverridesConfig } = require('./utils');

let webpackConfig = merge(commonConfig, {
    mode: 'development',
    // 开发环境本地启动的服务配置
    devServer: {
        port: 9000,
        hot: true,
        open: true,
        historyApiFallback: true,
        compress: true,
        // 接口代理转发
        proxy: {
            // 代理
            '/testapi': {
                target: 'https://www.easy-mock.com/mock/5dff0acd5b188e66c6e07329/react-template',
                changeOrigin: true,
                secure: false,
                pathRewrite: { '^/testapi': '' },
            },
        },
    },

    plugins: [new webpack.HotModuleReplacementPlugin()],
    devtool: 'eval-source-map',
});

//读取覆盖默认webpack的配置
const webpackOverride = getWebpackOverridesConfig();

if (typeof webpackOverride === 'function') {
    const resConfig = webpackOverride(webpackConfig, process.env.NODE_ENV);
    if (typeof resConfig === 'object') webpackConfig = resConfig;
}

module.exports = webpackConfig;
