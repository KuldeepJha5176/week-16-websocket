import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
}


const allSockets = new Map<string, User>();
wss.on("connection", (socket) => {
  
    
  socket.on("message", (message) => {
   const parsedMessage = JSON.parse(message);
   if(parsedMessage.type == "join" ){
    const socketId = parsedMessage.payload.userId || socket.protocol || generateUniqueId();
    allSockets.set(socketId,
      {socket,
      room: parsedMessage.payload.roomId}
    )
   }
  });
  function generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
});
