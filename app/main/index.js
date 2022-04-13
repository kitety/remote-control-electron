const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");
const path = require("path");

let win;
app.on("ready", () => {
  win = new BrowserWindow({
    width: 600,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  if (isDev) {
    win.loadURL("http://localhost:3000");
  } else {
    //   第三章
    win.loadFile(path.resolve(__dirname, "../renderer/pages/main/index.html"));
  }
});
