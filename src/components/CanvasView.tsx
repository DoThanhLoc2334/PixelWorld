import { useEffect, useRef } from "react";
import { createPixiApp } from "../pixi";
import { Application, Color, Container, Graphics, Sprite, Assets, loadTextures, Texture } from "pixi.js"
import { Viewport } from "pixi-viewport";
import { io } from "socket.io-client";
import axios from 'axios'
//import { text } from "stream/consumers";

type CanvasViewProps = { selectedColor?: string };
let stage: Viewport;
let getSelectedColor = () => "#1e90ff";
const gridSize = 50;
let cellMap: Sprite[][] = [];
const socket = io("http://localhost:3000", {
    transports: ["websocket", "polling"], 
    autoConnect: false, 
});
let texturelist = await LoadTexture();

export default function CanvasView({ selectedColor = "#1effa5ff" }: CanvasViewProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    getSelectedColor = () => selectedColor;
    useEffect(() => {
        // Socket event listeners
        // socket.on("connect", () => {
        //     console.log("Connected to PixelWord!");
        // });

        // socket.on("disconnect", () => {
        //     console.log("Server disconnected");
        // });

        // // Connect to server if not already connected
        // if (!socket.connected) {
        //     socket.connect();
        // }

        if (!canvasRef.current) return;
        let app: Application;
        let grid = Array(20);

        (async () => {
            app = await createPixiApp(canvasRef.current!);
            stage = new Viewport({
                screenWidth: app.renderer.width,
                screenHeight: app.renderer.height,
                worldWidth: 5000,
                worldHeight: 5000,
                events: app.renderer.events,
            })

            stage.resize(app.screen.width, app.screen.height);

            app.stage.addChild(stage);

            stage.drag()
            stage.pinch()
            stage.wheel()
            stage.decelerate();
            registerSocketListeners();
            if (!socket.connected) {
                socket.connect();
            }
            // await axios.get('http://localhost:8080').then((response) => {
            //     grid = response.data;
            // });
            // for (let i = 0; i < 20; i++) {
            //     for (let j = 0; j < 20; j++) {
            //         let cell = CreateCell(j, i, gridSize, grid[i][j]);
            //         stage.addChild(cell);
            //     }
            // }
            app.stage.addChild(stage);

        })();
        console.log("Fired");

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("initGrid");
            socket.off("updateCell");
            socket.off("serverMessage");
            socket.off("connect_error");

            if (app) {
                app.destroy(true, { children: true });
                app.canvas.remove();
            }
        };
    }, []);

    return (<div ref={canvasRef} style={{ width: "100%", height: "100%" }}>
    </div>);
}

function registerSocketListeners() {
    // Socket event listeners   
    socket.on("connect", () => {
        console.log("Connected to PixelWord!");
    });

    socket.on("disconnect", () => {
        console.log("Server disconnected");
    });

    socket.on("initGrid", (serverGrid:any[][]) => {
        console.log("Received full grid from server");
        rendergridexperimental(serverGrid);
        //rendergrid(serverGrid);
    });

    // update khi co nguoi doi mau
    socket.on("updateCell", ({ x, y, color }) => {
        const cell = cellMap[y][x];
        if (!cell) return;
        // update cell khi nhan duoc update tu server(co the tu client khac hoac chinh ban than)
        updateCellColor(cell, x, y, color);
    })

    socket.on("serverMessage", (data: {message: string}) => {
        console.log("Message from Server:", data.message);
    });
}



function updateCellColor(cell: Sprite, x: number, y: number, color: string) {
    if (!cell) return;
    // cell.clear();
    // cell.rect(x * gridSize, y * gridSize, gridSize, gridSize).fill(color);
}

function rendergridexperimental(serverGrid: any[][])
{

        const rows = serverGrid.length;
        const cols = serverGrid[0].length;
        cellMap = Array.from({ length: rows }, () => Array(cols));
        let grid = new Graphics();
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                grid.rect(x * gridSize, y * gridSize, gridSize, gridSize).fill('red');
            }
        }
        grid.on('pointermove', (event) => {
        })
        stage.addChild(grid);   
}




function rendergrid(serverGrid: any[][])
{
const rows = serverGrid.length;
        const cols = serverGrid[0].length;
        cellMap = Array.from({ length: rows }, () => Array(cols));
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const color = serverGrid[y][x] || "#4f0707";
                const cell = CreateCell(x, y, gridSize, color);
                cellMap[y][x] = cell;
                stage.addChild(cell);
            }
        }
}

function CreateCell(xindex: number, yindex: number, length: number, color: string) {
    let cell = new Sprite(texturelist[0]);
    cell.position.set(xindex * gridSize, yindex * gridSize);
    cell.eventMode = 'static';
    cell.cursor = 'pointer';
    cell.on('pointerdown', () => {
        let x = xindex;
        let y = yindex;
        let newcolor = getSelectedColor();
        updateCellColor(cell, x, y, newcolor)
        stage.addChild(cell);
        socket.emit("cellClick", { x: x, y: y, color: newcolor });
    });
    cell.cullable = true;
    return cell;
}
async function LoadTexture()
{
    let texturelist = Array();
    let redcell = await Assets.load("./src/assets/redcell.png");
    let bluecell = await Assets.load("./src/assets/bluecell.png");
    let greencell = await Assets.load("./src/assets/greencell.png");
    texturelist.push(redcell);
    texturelist.push(bluecell);
    texturelist.push(greencell);
    return texturelist;
}