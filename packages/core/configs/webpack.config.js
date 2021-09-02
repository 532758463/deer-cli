const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.common');
const MinCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { getWebpackOverridesConfig } = require('./utils');
const webpack = require('webpack');
const os = require('os');

const buildTime = new Date().toLocaleString();

//对js进行打包处理的插件
const TerserPlugin = require('terser-webpack-plugin');

/**
 * @type {Configuration}
 */
let webpackConfig = merge(baseWebpackConfig, {
    mode: 'production',
    stats: { children: false, warnings: false },
    plugins: [
        //对css进行抽离
        new MinCssExtractPlugin({
            // contenthash：CSS 文件特有的 hash 值，是根据 CSS 文件内容计算出来的，CSS 发生变化则其值发生变化，**推荐 CSS 导出中使用**。
            filename: 'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[id].[contenthash:8].css',
            ignoreOrder: false,
        }),
        new webpack.BannerPlugin({
            banner: `chunkhash:[chunkhash], name:[name], file:[file], buildTime: ${buildTime}`,
          }),
    ],
    optimization: {
        minimize: true,
        concatenateModules: true, // 开启 Scope-Hosting
        minimizer: [
            new TerserPlugin({
                test: /\.js(\?.*)?$/i,
                parallel: os.cpus().length - 1,
                terserOptions: {
                    compress: {
                        drop_console: false,
                    },
                },
            }),
            //对css进行压缩
            new CssMinimizerPlugin(),
        ],
        //分割代码
        splitChunks: {
            chunks: 'all',
            /**
             * initial 入口 chunk 对于异步导入的文件不处理
             * async 异步 chunk支队异步导入的文件处理
             * all 全部 chunk
             */
            //缓存分组
            cacheGroups: {
                //第三方模块，如lodash
                vendor: {
                    name: 'vendor', // chunk名称
                    priority: 1, //权限更高，优先抽离,重要！！！
                    test: /node_modules/,
                    // maxSize: 0, //大小限制
                    // minChunks:1   //最少使用次数
                },
                commons: {
                    name: 'commons', //chunk 名称
                    chunks: 'initial',
                    priority: 0,
                    minChunks: 3,
                    enforce: true,
                },
            },
        },
    },
});

//读取覆盖默认webpack的配置
const webpackOverride = getWebpackOverridesConfig();

if (typeof webpackOverride === 'function') {
    const resConfig = webpackOverride(webpackConfig, process.env.NODE_ENV);
    if (typeof resConfig === 'object') webpackConfig = resConfig;
}

module.exports = webpackConfig;
