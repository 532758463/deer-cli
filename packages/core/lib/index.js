"use strict";
const fs = require("fs");
const program = require('commander');
const semver = require("semver");
const colors = require("colors");
const userHome = require("user-home");
const pkg = require("../package.json");
const constant = require("./const");
const { downloadTemplate } = require("../scripts/init");
const { runBuild, runStart,log } = require("../scripts")

module.exports = core;

async function core() {
  try {
    log.success("deer-cli")
    await prepare();
    registerCommand()
    // TODO
  } catch (error) {
    log.error(error.message);
  }
}

function checkInputArgs() {
  log.verbose("开始校验输入参数");
  const minimist = require("minimist");
  const args = minimist(process.argv.slice(2)); // 解析查询参数
  checkArgs(args); // 校验参数
  log.verbose("输入参数", args);
}

function registerCommand() {

  program.command('init [projectName]')
    .description('项目初始化')
    .option('-t, --template <template>', '创建应用模板类型')
    .option('-n, --noverify', '不验证版本')
    .action(function (projectName, options) {
      downloadTemplate(projectName, options.template, options.noverify);
    })
  program.command('start').description('启动开发环境').action(runStart);
  program.command('build').description('构建项目').action(runBuild);

  program
    .option('--debug', '打开调试模式')
    .parse(process.argv);
}

function checkArgs(args) {
  if (args.debug) {
    process.env.LOG_LEVEL = "verbose";
  } else {
    process.env.LOG_LEVEL = "info";
  }
  log.level = process.env.LOG_LEVEL;
}

function checkUserHome() {
  if (!userHome || !fs.existsSync(userHome)) {
    throw new Error(colors.red("当前登录用户主目录不存在！"));
  }
}

// 检查用户权限
function checkRoot() {
  const rootCheck = require("root-check");
  rootCheck();
}

function checkNodeVersion() {
  // 1.获取node版本号
  const currentVersion = process.version;
  // 2. 对比最低版本号

  // 3. semver库做版本号比对
  const lowerVersion = constant.LOWER_NODE_VERSION;

  if (!semver.gte(currentVersion, lowerVersion)) {
    throw new Error(
      colors.red(`deer-cli 需要安装${lowerVersion}以上版本的Nodejs`)
    );
  }
}

// 检查package version
function checkPkgVersion() {
  log.notice(pkg.version);
}

async function prepare() {
  checkPkgVersion(); // 检查当前运行版本
  checkNodeVersion(); // 检查 node 版本
  checkRoot(); // 检查是否为 root 启动
  checkUserHome(); // 检查用户主目录
  checkInputArgs(); // 检查用户输入参数
}

