const { BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");
let win;

function create() {
  win = new BrowserWindow({
    width: 1000,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // if (isDev) {
  //   win.loadURL("http://localhost:3000");
  // } else {
  //   第三章
  win.loadFile(path.resolve(__dirname, "../../renderer/pages/control/index.html"));
  // }
}
module.exports = { createControlWindow: create };
