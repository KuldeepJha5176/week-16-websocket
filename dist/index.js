"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const allSockets = new Map();
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type == "join") {
            const socketId = parsedMessage.payload.userId || socket.protocol || generateUniqueId();
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
            for (const [key, value] of allSockets) {
                if (value.room == currentUserRoom)
                    value.socket.send(parsedMessage.payload.message);
            }
        }
    });
    function generateUniqueId() {
        return Math.random().toString(36).substring(2, 15);
    }
});
