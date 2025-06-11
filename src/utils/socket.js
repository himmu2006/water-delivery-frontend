import { io } from "socket.io-client";

// Set your backend server URL
const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Get token from localStorage
const token = localStorage.getItem("token"); // Adjust key if stored differently

// Initialize socket connection with auth token
export const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  autoConnect: true,
  auth: {
    token: token,
  },
});

// Optionally listen for connection events
socket.on("connect", () => {
  console.log("🟢 Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("🔴 Socket disconnected");
});
