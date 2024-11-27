import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let userCount = 0;
let allSockets: WebSocket[] = []

wss.on("connection", (socket) => {
  allSockets.push(socket);
  userCount = userCount + 1;
  console.log("User connected #" + userCount);

  socket.on("message", (message) => {
    console.log("message received " + message.toString());
    setTimeout(() => {
      for (let i = 0; i < allSockets.length; i++) {
        const s = allSockets[i];
        s.send(message.toString() + "message received from the server");
      }
    }, 1000);
  });
});
