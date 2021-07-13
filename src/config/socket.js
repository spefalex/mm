import { io } from "socket.io-client";

let socket;
export const initiateSocketConnection = () => {
  socket = io("https://api.autocopain.lebackyard.ovh", {
    auth: {
      token: "cde",
    },
  });
  console.log(`Connecting socket...`);
};
export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
  if (socket) socket.disconnect();
};
export const subscribeToNotifications = (cb) => {
  if (!socket) return true;
  socket.on("notifications", (msg) => {
    console.log("Websocket event received!");
    return cb(null, msg);
  });
};
export const sendMessage = (data) => {
  if (socket) socket.emit("sendNotification", { data });
};
