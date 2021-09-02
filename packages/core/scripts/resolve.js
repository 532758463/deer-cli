const fs = require("fs");
const path = require("path");

const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const resolveCore = (relativePath) =>
  path.resolve(`${appDirectory}/node_modules/@tonice/core/`, relativePath);


module.exports = {
  resolveApp,
  resolveCore
};
