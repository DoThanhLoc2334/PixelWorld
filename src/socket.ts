import { io } from "socket.io-client";
export const socket = io("http://localhost:3000", {
    transports: ["websocket", "polling"], 
    autoConnect: false, 
});
// import { io } from "socket.io-client";
// export const socket = io("http://localhost:3000", {
//     transports: ["websocket"],
// });

