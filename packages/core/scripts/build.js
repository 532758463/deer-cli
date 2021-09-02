const exec = require('./exec')
const { resolveCore } = require('./resolve')

function runBuild() {
    const projectPath = `${process.cwd()}/node_modules`;
    const buildType =
        ["zip", "default"].indexOf(process.argv[3]) >= 0
            ? process.argv[3]
            : "default";
    const args = [
        "NODE_ENV=production",
        `BUILD_TYPE=${buildType}`,
        `${projectPath}/webpack/bin/webpack.js`,
        "--config",
        resolveCore("./configs/webpack.config.js"),
        "--progress",
    ];

    exec("cross-env", args, {
        stdio: "inherit",
    });
}

module.exports = runBuild;
