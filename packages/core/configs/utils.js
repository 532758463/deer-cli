const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
// const { ModuleFederationPlugin } = require("webpack").container;
const __DEV__ = process.env.NODE_ENV !== 'production';
const { loader } = require('mini-css-extract-plugin');
const path = require('path');
const appDirectory = fs.realpathSync(process.cwd());
const isProduction = process.env.NODE_ENV === "production";

const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const pkg = require(`${resolveApp("")}/package.json`);
const name = pkg.name;
const resolveCore = (relativePath) =>
  path.resolve(`${appDirectory}/node_modules/@tonice/core/`, relativePath);



function getCssLoaders(importLoaders) {
  return [
    __DEV__ ? 'style-loader' : loader,
    {
      loader: 'css-loader',
      options: {
        modules: false,
        // 前面使用的每一个 loader 都需要指定 sourceMap 选项
        sourceMap: true,
        // 指定在 css-loader 前应用的 loader 的数量
        importLoaders,
      },
    },
    {
      loader: 'postcss-loader',
      options: { sourceMap: true },
    },
  ];
}


const externals = {
  react: "React",
  "react-dom": "ReactDOM",
  redux: "Redux",
  "react-redux": "ReactRedux",
  "react-router-dom": "ReactRouterDOM",
  classnames: "classnames",
};

const resolve = {
  modules: ["node_modules", resolveApp("src")],
  extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  alias: {
    "@": resolveApp("src"),
    "@assets": resolveApp("src/assets"),
    "@components": resolveApp("src/components"),
    "@constants": resolveApp("src/constants"),
    "@pages": resolveApp("src/pages"),
    "@services": resolveApp("src/services"),
    "@utils": resolveApp("src/utils"),
    "@locales": resolveApp("src/locales"),
  },
};

const plugins = [
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(
      process.env.NODE_ENV || "development"
    ),
  }),
  new HtmlWebpackPlugin({
    template: "public/index.html",
    favicon: getFavicon(),
    alwaysWriteToDisk: !isProduction,
  }),
];

function getFavicon() {
  if (fs.existsSync(`${resolveApp("public")}/favicon.ico`)) {
    return "./public/favicon.ico";
  }
  return null;
}


// 自定义webpack配置
function getWebpackOverridesConfig() {
  try {
    return fs.existsSync(`${resolveApp("")}/webpack-overrides.js`)
      ? require(`${resolveApp("")}/webpack-overrides.js`)
      : null;
  } catch (error) {
    return null;
  }
}


module.exports = {
  name,
  resolve,
  plugins,
  externals,
  resolveApp,
  getWebpackOverridesConfig,
  getCssLoaders,
  resolveCore
};
