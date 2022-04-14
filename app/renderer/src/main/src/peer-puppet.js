const { ipcRenderer } = require("electron");
// create Answer
const pc = new window.RTCPeerConnection({});

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
