const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8010 });

const code2ws = new Map();
wss.on("connection", (ws, req) => {
  // ws 端
  let code = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  code2ws.set(code, ws);
  ws.sendData = (event, data) => {
    ws.send(JSON.stringify({ event, data }));
  };
  ws.on("message", (message) => {
    console.log("received: %s", message);
    // {event data}
    let parseMessage = {};
    try {
      parseMessage = JSON.parse(message);
    } catch (error) {
      ws.send("message invalid");
      console.log("message invalid");
      return;
    }
    let { event, data } = parseMessage;
    if (event === "login") {
      ws.sendData("logined", code);
    } else if (event === "control") {
      let remote = +data.remote;
      if (code2ws.has(remote)) {
        ws.sendData("controlled", { remote });
        // 本的远程发送就是远程的发送
        ws.sendRemote = code2ws.get(remote).sendData;
        code2ws.get(remote).sendRemote = ws.sendData;
        ws.sendRemote("be-controlled", { remote: code });
      }
    } else if (event === "forward") {
      // data  {event, data}
    //   const { event, data } = data;
      ws.sendRemote(data.event, data.data);
    }
  });
  ws.on("close", () => {
    code2ws.delete(code);
    clearTimeout(ws._closeTimeout);
  });
  ws._closeTimeout = setTimeout(() => {
    ws.terminate();
  }, 10 * 60 * 1000);
});
