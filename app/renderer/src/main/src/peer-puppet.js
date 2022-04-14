const { ipcRenderer } = require("electron");
// create Answer
const pc = new window.RTCPeerConnection({});
// anIcecandidate iceEvent
// add ice candidate

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

async function getScreenStream() {
  const sources = await ipcRenderer.invoke("DESKTOP_CAPTURER_GET_SOURCES", {
    types: ["screen"],
  });
  return new Promise((resolve, reject) => {
    navigator.webkitGetUserMedia(
      {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: sources[0].id,
            maxWidth: window.screen.width,
            maxHeight: window.screen.height,
          },
        },
      },
      (stream) => {
        resolve(stream);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
async function createAnswer(offer) {
  let screenStream = await getScreenStream();
  pc.addStream(screenStream);
  await pc.setRemoteDescription(offer);
  await pc.setLocalDescription(await pc.createAnswer());
  console.log("pc.localDescription: ", JSON.stringify(pc.localDescription));
  return pc.localDescription;
}
window.createAnswer = createAnswer;
