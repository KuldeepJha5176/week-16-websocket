import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}

const allSockets = new Map<string, User>();
wss.on("connection", (socket) => {
  socket.on("message", (message) => {
    const parsedMessage = JSON.parse(message as unknown as string);
    if (parsedMessage.type == "join") {
      const socketId =
        parsedMessage.payload.userId || socket.protocol || generateUniqueId();
      allSockets.set(socketId, { socket, room: parsedMessage.payload.roomId });
    }

    if (parsedMessage.type == "chat") {
      // const currentUserRoom = Array.from(allSockets.values()).find((x) => x.socket = socket)?.room
      let currentUserRoom = null;
      for (const [key, value] of allSockets) {
        if ((value.socket === socket)) {
          currentUserRoom = value.room;
        } // iteration in maps in typescript
      }
      for(const [key,value] of allSockets) {
        if(value.room == currentUserRoom)
          value.socket.send(parsedMessage.payload.message)
      }
    }
  
  });
  function generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
});
