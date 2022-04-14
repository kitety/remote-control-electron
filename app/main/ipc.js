const { ipcMain } = require("electron");
const { createControlWindow } = require("./window/controls");
const { sendMainWindow } = require("./window/main");

module.exports = function () {
  ipcMain.handle("login", async () => {
    //   返回code
    let code = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return code;
  });

  ipcMain.handle("control", async (e, remoteCode) => {
    //   跟服务器交互
    sendMainWindow("control-state-change", remoteCode, 1);
    createControlWindow(remoteCode);
  });
};
