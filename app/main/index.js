const handleIPC = require("./ipc");
const { createMainWindow } = require("./window/main");
const { app } = require("electron");

app.on("ready", () => {
  createMainWindow();
  handleIPC();
});
