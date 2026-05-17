import { io } from "socket.io-client";

const socket = io("https://monnit24.onrender.com", {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;