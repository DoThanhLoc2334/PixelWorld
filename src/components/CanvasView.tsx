import { useEffect, useRef } from "react";
import { createPixiApp } from "../pixi";
import { Application, Color, Container, Graphics, Sprite, Assets, loadTextures, Texture } from "pixi.js"
import { Viewport } from "pixi-viewport";
import { io } from "socket.io-client";

type CanvasViewProps = { selectedColor?: string };
let stage: Viewport;
let getSelectedColor = () => "#1e90ff";
const gridSize = 50;
let cellMap: Graphics[][] = [];
let isPaiting = false;
let lastPaintX = -1;
let lastPaintY = -1;
let lastEmitTime = 0;
const min_emit_interval_ms = 30;

const socket = io("http://localhost:3000", {
    transports: ["websocket", "polling"],
    autoConnect: false,
});
let pointergraphic = new Graphics();
pointergraphic.eventMode = 'none';
pointergraphic.alpha = 0.5;
let pointercellx: number;
let pointercelly: number;

type CanvasProps = {
    selectedColor: string,
    isDrawingEnabled: boolean
}
let isDrawable: boolean
let grid = new Graphics();

export default function CanvasView({selectedColor, isDrawingEnabled} : CanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    getSelectedColor = () => selectedColor;
    isDrawable = isDrawingEnabled;
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                isPaiting = true;
            }
        };

        const onKeyUp = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                e.preventDefault();
                isPaiting = false;
                lastPaintX = -1;
                lastPaintY = -1;
            }
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp)

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
            });

            stage.on('pointermove', (e: any) => {
                if (!isPaiting)
                    return;
                const global = e.data.global;

                const world = stage.toWorld(global.x, global.y);
                const xindex = Math.floor(world.x / gridSize);
                const yindex = Math.floor(world.y / gridSize);
                paintCellAt(xindex, yindex, getSelectedColor());
            });

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
            app.stage.addChild(stage);

        })();
        console.log("Fired");

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);

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

    socket.on("initGrid", (serverGrid: any[][]) => {
        console.log("Received full grid from server");
        rendergrid(serverGrid);
        //rendergrid(serverGrid);
    });

    // update khi co nguoi doi mau
    socket.on("updateCell", ({ x, y, color }) => {
        const cell = cellMap[y][x];
        if (!cell) return;
        // update cell khi nhan duoc update tu server(co the tu client khac hoac chinh ban than)
        updateCellColor(cell, x, y, color);
    })

    socket.on("serverMessage", (data: { message: string }) => {
        console.log("Message from Server:", data.message);
    });
}



function updateCellColor(cell: Graphics, x: number, y: number, color: string) {
    if (!cell) return;
    cell.clear();
    cell.rect(x * gridSize, y * gridSize, gridSize, gridSize).fill(color);
}

function rendergrid(serverGrid: any[][])
{

        const rows = serverGrid.length;
        const cols = serverGrid[0].length;
        cellMap = Array.from({ length: rows }, () => Array(cols));
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                grid.rect(x * gridSize, y * gridSize, gridSize, gridSize).fill('red');
            }
        }
        grid.eventMode = 'static';
        grid.cursor = 'pointer';
        grid.on('pointermove', (event) => {
            let mouseposition = stage.toWorld(event.global);
            let x = mouseposition.x;
            let y = mouseposition.y;
            pointergraphic.clear();
            let normalizedx = Math.floor(x / gridSize) * gridSize;
            let normalizedy = Math.floor(y / gridSize) * gridSize;
            pointercellx = normalizedx;
            pointercelly = normalizedy;
            pointergraphic.rect(normalizedx, normalizedy,gridSize, gridSize).fill('blue');
        });
        grid.on('pointerdown', () => {
            if(!isDrawable)
            {
                return;
            }
            console.log('pressed');
            grid.rect(pointercellx, pointercelly, gridSize, gridSize).fill(getSelectedColor());
        });
        stage.addChild(grid);   
        stage.addChild(pointergraphic);
}




// function rendergrid(serverGrid: any[][])
// {
// const rows = serverGrid.length;
//         const cols = serverGrid[0].length;
//         cellMap = Array.from({ length: rows }, () => Array(cols));
//         for (let y = 0; y < rows; y++) {
//             for (let x = 0; x < cols; x++) {
//                 const color = serverGrid[y][x] || "#4f0707";
//                 const cell = CreateCell(x, y, gridSize, color);
//                 cellMap[y][x] = cell;
//                 stage.addChild(cell);
//             }
//         }
// }

// function CreateCell(xindex: number, yindex: number, length: number, color: string) {
//     let cell = new Graphics();
//     cell.position.set(xindex * gridSize, yindex * gridSize);
//     cell.eventMode = 'static';
//     cell.cursor = 'pointer';
//     cell.on('pointerdown', () => {
//         let x = xindex;
//         let y = yindex;
//         let newcolor = getSelectedColor();
//         updateCellColor(cell, x, y, newcolor)
//         stage.addChild(cell);
//         socket.emit("cellClick", { x: x, y: y, color: newcolor });
//     });
//     cell.cullable = true;
//     return cell;
// }

function paintCellAt(xindex: number, yindex: number, color: string) {
    if (xindex < 0 || yindex < 0 || !cellMap[yindex] || !cellMap[yindex][xindex]) return;
    // avoid repeat same cell
    if (xindex === lastPaintX && yindex === lastPaintY) return;
    lastPaintX = xindex;
    lastPaintY = yindex;

    const cell = cellMap[yindex][xindex];
    const targetHex = parseInt(color.replace("#", ""), 16);
    const currentHex = cell.fillStyle?.color;
    if (currentHex === targetHex) return;

    updateCellColor(cell, xindex, yindex, color);

    const now = Date.now();
    if (now - lastEmitTime >= min_emit_interval_ms) {
        lastEmitTime = now;
        socket.emit("cellClick", { x: xindex, y: yindex, color });
    }
}