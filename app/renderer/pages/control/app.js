const peer = require("./peer-control");

peer.on("add-stream", (stream) => {
  play(stream);
});

function play(stream) {
  const video = document.getElementById("video");
  video.srcObject = stream;
  video.onloadedmetadata = function (e) {
    video.play();
  };
}
// keyboard
window.onkeydown = function (e) {
  // data {keyCode, meta, alt, ctrl, shift}
  let data = {
    keyCode: e.keyCode,
    shift: e.shiftKey,
    meta: e.metaKey,
    control: e.ctrlKey,
    alt: e.altKey,
  };
  peer.emit("robot", "key", data);
};
// mouse
window.onmouseup = function (e) {
  // data {clientX, clientY, screen: {width, height}, video: {width, height}}
  let data = {};
  data.clientX = e.clientX;
  data.clientY = e.clientY;
  data.video = {
    width: video.getBoundingClientRect().width,
    height: video.getBoundingClientRect().height,
  };
  peer.emit("robot", "mouse", data);
};
