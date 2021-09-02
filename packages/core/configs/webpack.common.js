const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
//对路径进行大小写严格检查
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const WebpackBar = require('webpackbar');
const { getCssLoaders, resolveApp, resolve, resolveCore } = require('./utils');
const isProduction = process.env.NODE_ENV === 'production';
const filepath = `${resolveCore('vendor')}/vendor${isProduction ? '.min.js' : '.js'}`;
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

/**
 * @type {Configuration}
 */
const config = {
    devtool: 'eval-cheap-module-source-map',
    target: 'web',
    watch: true,
    watchOptions: {
        poll: true,
        ignored: /node_modules/,
    },
    cache: {
        type: 'memory',
    },
    optimization: {
        moduleIds: 'named',
    },
    entry: {
        index: [resolveApp('src/entry.tsx')],
    },
    output: {
        path: resolveApp("./dist"),
        filename: '[name].[chunkhash:8].js',
        chunkFilename: 'chunk/[name].[chunkhash:8].js',
    },
    resolve,
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                include: /(src)/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: getCssLoaders(0),
            },
            {
                test: /\.less$/,
                use: [
                    ...getCssLoaders(2),
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    ...getCssLoaders(2),
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true },
                    },
                ],
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            // 低于 10 k 转换成 base64
                            limit: 10 * 1024,
                            // 在文件名中插入文件内容 hash，解决强缓存立即更新的问题
                            name: '[name].[contenthash].[ext]',
                            outputPath: 'images',
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|woff|woff2|eot|otf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name]-[contenthash].[ext]',
                            outputPath: 'fonts',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        }),
        new AddAssetHtmlPlugin({
            filepath,
            hash: isProduction,
        }),
        new HtmlWebpackPlugin({
            template: `${process.cwd()}/public/index.html`,
            alwaysWriteToDisk: !isProduction,
        }),
        new HtmlWebpackHarddiskPlugin(),
        new CleanWebpackPlugin(),
        new CaseSensitivePathsPlugin(),
        new WebpackBar({
            name: 'react-ts',
            // react 蓝
            color: '#61dafb',
        }),
    ],
};
module.exports = config;
