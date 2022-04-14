import "./App.css";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import "./peer-puppet.js";
console.log("ipcRenderer: ", ipcRenderer);

function App() {
  const [remoteCode, setRemoteCode] = useState("");
  const [localCode, setLocalCode] = useState("");
  const [controlText, setControlText] = useState("");

  const login = async () => {
    let code = await ipcRenderer.invoke("login");
    setLocalCode(code);
  };
  const startControl = (code) => {
    ipcRenderer.invoke("control", code);
  };
  const handleControlState = (e, name, type, value) => {
    let text = "";
    if (type === 1) {
      text = `正在远程控制:${name}`;
    } else {
      text = `被${name}控制中`;
    }
    setControlText(text);
  };

  useEffect(() => {
    login();
    ipcRenderer.on("control-state-change", handleControlState);
    return () => {
      ipcRenderer.removeListener("control-state-change", handleControlState);
    };
  }, []);
  return (
    <div className="App">
      {controlText ? (
        <div>{controlText}</div>
      ) : (
        <>
          <div>你的控制码:{localCode}</div>
          <input
            type="text"
            value={remoteCode}
            onChange={(e) => setRemoteCode(e.target.value)}
          />
          <button
            onClick={() => {
              startControl(remoteCode);
            }}
          >
            确认
          </button>
        </>
      )}
    </div>
  );
}

export default App;
