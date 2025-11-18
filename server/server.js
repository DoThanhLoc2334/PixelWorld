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

const gridSize = 50;
const gridCols = 500;
const gridRows = 500;
let grid = Array.from({length: gridRows}, () => 
    Array(gridCols).fill("#4f0707")
);

app.get("/", (req, res) => {
    res.send("PixelWorld server is running!")
});

io.on("connection", (socket) => {
    console.log(" A user connected: ", socket.id);

    socket.emit("initGrid", grid); // gui toan bo grid khi client moi vao

    socket.on("cellClick", (data) => {
        const {x, y, color} = data;
        console.log(`User ${socket.id} clicked cell (${x}, ${y}) -> ${color}`);

        grid[y][x] = color;

        io.emit("updateCell", {x, y, color}); 
        socket.emit("serverMessage", {
            message: `Server nhận được click tại ô (${data.x}, ${data.y}, ${color})`
        });
    });



    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


