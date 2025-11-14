import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import fs from 'node:fs';

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // allow all origin
    },
});

const gridSize = 50;
const gridCols = 500
const gridRows = 500
const filepath = './grid.txt'
let grid = Array.from({length: gridRows}, () => 
    Array(gridCols).fill("#4f0707")
);
let gridjson = JSON.stringify(grid);
if(!fs.existsSync(filepath))
{
    let gridjson = JSON.stringify(grid);
    fs.writeFileSync(filepath, JSON.stringify(gridjson));
}else{
    let gridjson = fs.readFileSync(filepath, "utf-8");
    grid = JSON.parse(gridjson);
}


io.on("connection", (socket) => {
    console.log(" A user connected: ", socket.id);

    socket.emit("initGrid", grid); // gui toan bo grid khi client moi vao

    socket.on("cellClick", (data) => {
        const {x, y, color} = data;
        console.log(`User ${socket.id} clicked cell (${x}, ${y}) -> ${color}`);

        grid[y][x] = color;
        fs.writeFileSync(filepath, JSON.stringify(grid));
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


