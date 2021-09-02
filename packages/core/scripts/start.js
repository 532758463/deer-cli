//  webpack 开发环境配置
const exec = require("./exec");
const { resolveCore } = require("./resolve");

function runStart() {
  const portfinder = require("portfinder");
  portfinder.basePort = 3000;
  portfinder
    .getPortPromise()
    .then((port) => {
      process.env.PORT = port;

      const projectPath = `${process.cwd()}/node_modules`;
      exec(
        `${projectPath}/.bin/cross-env`,
        [
          "NODE_ENV=development",
          `${projectPath}/.bin/webpack-dev-server`,
          "--config",
          resolveCore("./configs/webpack.dev.js"),
          "--progress",
        ],
        {
          stdio: "inherit",
        }
      );
    })
    .catch((err) => {
      console.log("ERROR ", err);
    });
}

module.exports = runStart;
