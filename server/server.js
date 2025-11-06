import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // allow all origin
    },
});

app.get("/", (req, res) => {
    res.send("PixelWorld server is running!")
});

io.on("connection", (socket) => {
    console.log(" A user connected: ", socket.id);

    socket.on("cellClick", (data) => {
        console.log(`User ${socket.id} clicked cell:`, data);
    });

    socket.emit("serverMessage", {
        message: `Server nhận được click tại ô (${data.x}, ${data.y})`
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


