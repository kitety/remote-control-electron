const { ipcMain } = require("electron");
const signal = require("./signal");
const { createControlWindow, sendControlWindow } = require("./window/controls");
const { sendMainWindow } = require("./window/main");

module.exports = function () {
  ipcMain.handle("login", async () => {
    //   返回code
    // let code = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    // return code;
    let code = await signal.invoke("login", null, "logined");
    return code;
  });

  ipcMain.handle("control", async (e, remote) => {
    //   跟服务器交互
    // sendMainWindow("control-state-change", remoteCode, 1);
    // createControlWindow(remoteCode);
    signal.send("control", { remote });
  });
  signal.on("be-controlled", (data) => {
    console.log("data: ", data);
    sendMainWindow("control-state-change", data.remote, 1);
  });
  signal.on("controlled", (data) => {
    console.log("data: ", data);
    createControlWindow();
    sendMainWindow("control-state-change", data.remote, 2);
  });

  ipcMain.on("forward", (e, event, data) => {
    signal.send("forward", { event, data });
  });
  signal.on("offer", (data) => {
    sendMainWindow("offer", data);
  });
  signal.on("answer", (data) => {
    sendControlWindow("answer", data);
  });
  signal.on("puppet-candidate", (data) => {
    sendControlWindow("candidate", data);
  });
  signal.on("control-candidate", (data) => {
    sendMainWindow("candidate", data);
  });
};
