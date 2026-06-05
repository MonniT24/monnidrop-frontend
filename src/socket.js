import { io } from "socket.io-client";

const socket = io(
  "https://monnit24.onrender.com",
  {
    transports: ["polling", "websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  }
);

export default socket;