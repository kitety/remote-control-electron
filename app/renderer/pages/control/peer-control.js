const EventEmitter = require("events");

const peer = new EventEmitter();
// peer-puppet
const { ipcRenderer, desktopCapturer } = require("electron");

// async function getScreenStream() {
//   console.log("desktopCapturer: ", desktopCapturer);
//   const sources = await ipcRenderer.invoke("DESKTOP_CAPTURER_GET_SOURCES", {
//     types: ["screen"],
//   });

//   navigator.webkitGetUserMedia(
//     {
//       audio: false,
//       video: {
//         mandatory: {
//           chromeMediaSource: "desktop",
//           chromeMediaSourceId: sources[0].id,
//           maxWidth: window.screen.width,
//           maxHeight: window.screen.height,
//         },
//       },
//     },
//     (stream) => {
//       peer.emit("add-stream", stream);
//     },
//     (err) => {
//       //handle err
//       console.error(err);
//     }
//   );
// }
// getScreenStream();

// peer.on("robot", (type, data) => {
//   if (type === "mouse") {
//     data.screen = {
//       width: window.screen.width,
//       height: window.screen.height,
//     };
//   }
//   //   ipcRenderer.send("robot", type, data);
// });

const pc = new window.RTCPeerConnection({});

pc.onicecandidate = (event) => {
  console.log("event: ", JSON.stringify(event.candidate));
};

let candidates = [];
async function addIceCandidate(candicate) {
  console.log("candicate: ", candicate);
  // wait set pc.remoteDescription
  //   没有的话就放到缓冲池
  if (candicate) {
    candidates.push(candicate);
  }
  if (pc.remoteDescription && pc.remoteDescription.type) {
    for (let i = 0; i < candidates.length; i++) {
      await pc.addIceCandidate(new window.RTCIceCandidate(candidates[i]));
    }
    candidates = [];
  }
}
window.addIceCandidate = addIceCandidate;

async function createOffer() {
  const offer = await pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true,
  });
  await pc.setLocalDescription(offer);
  console.log("pc: ", JSON.stringify(offer));

  return pc.localDescription;
}
createOffer();

async function setRemote(answer) {
  await pc.setRemoteDescription(answer);
}
window.setRemote = setRemote;
pc.onaddstream = ({ stream }) => {
  console.log("add-stream: ", stream);
  peer.emit("add-stream", stream);
};

module.exports = peer;
