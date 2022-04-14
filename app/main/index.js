const handleIPC = require("./ipc");
const { createMainWindow } = require("./window/main");
const { app } = require("electron");
const { createControlWindow } = require("./window/controls");

app.on("ready", () => {
  createMainWindow();
  // createControlWindow();
  handleIPC();
  require("./robot.js")();
});
