const downloadGitRepo = require("download-git-repo");
const fsExtra = require("fs-extra");
const { resolveApp } = require("./resolve");
const chalk = require("chalk");
// const { log } = require("@tonice/utils");
const getNpmPkgVersion = require("get-npm-package-version");
const semver = require('semver')
const { log } = require("../scripts")

// 下载模板
function downloadTemplate(projectName = "react-ts", template = "react", noverify = true) {
  log.warn("init project")
  console.log(projectName, template);

  updateWarning()
  //  是否验证版本
  if (!noverify) {
    updateWarning()
  }

  checkProjectExist(projectName);

  downloadGitRepo(
    // 模板项目地址
    `direct:git@github.com:532758463/${projectName}-template.git`,
    // dir
    projectName,
    {
      clone: true,
    },
    function (err) {
      if (err) {
        log.error(`初始化项目失败，请确认本地已正常配置SSH密钥。`);
      } else {
        log.success("初始化项目成功");
      }
    }
  );
}

// 检查项目是否存在
function checkProjectExist(projectName) {
  if (fsExtra.existsSync((0, resolveApp)(projectName))) {
    log.warn(`${chalk.blue(projectName)} 已经存在于当前目录。`);
    process.exit(1);
  }
}

// 脚手架更新提示
function updateWarning() {
  const latestVersion = getNpmPkgVersion("@tonice/deer-ui");
  console.log(chalk.blue(latestVersion));
  console.log(semver.gte(latestVersion, '1.0.0'))
}



module.exports = {
  downloadTemplate
}