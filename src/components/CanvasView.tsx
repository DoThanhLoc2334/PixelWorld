import { useEffect, useRef } from "react";
import { createPixiApp } from "../pixi";
import { Application, Color, Container, Graphics } from "pixi.js"
import { Viewport } from "pixi-viewport";
import { io } from "socket.io-client";

type CanvasViewProps = { selectedColor?: string };
let stage: Viewport;
let getSelectedColor = () => "#1e90ff";
const gridSize = 50;
let cellMap: Graphics[][] = [];
const socket = io("http://localhost:3000", {
    transports: ["websocket", "polling"],
    autoConnect: false,
});


export default function CanvasView({ selectedColor = "#1effa5ff" }: CanvasViewProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    getSelectedColor = () => selectedColor;
    useEffect(() => {

        if (!canvasRef.current) return;
        let app: Application;

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
            // registerSocketListeners();
            // if (!socket.connected) {
            //     socket.connect();
            // }
            RenderDebugGrid();
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
    socket.on("connect", () => {
        console.log("Connected to PixelWord!");
    });

    socket.on("disconnect", () => {
        console.log("Server disconnected");
    });

    socket.on("initGrid", (serverGrid: any[][]) => {
        console.log("Received full grid from server");
        rendergrid(serverGrid);
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

function RenderDebugGrid() {
    const gridCols = 500;
    const gridRows = 500;
    let grid = Array.from({ length: gridRows }, () =>
        Array(gridCols).fill("#4f0707"));
    rendergrid(grid)
}

function updateCellColor(cell: Graphics, x: number, y: number, color: string) {
    if (!cell) return;
    cell.clear();
    cell.rect(x * gridSize, y * gridSize, gridSize, gridSize).fill(color);
}


// function CreateCell(xindex: number, yindex: number, length: number, color: string) {

//     let cell = new Graphics().rect(xindex * length, yindex * length, length, length).fill(color);
//     cell.cullable = true;
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
//     return cell;
// }
function rendergrid(serverGrid: any[][]) {
    const rows = serverGrid.length;
    const cols = serverGrid[0].length;
    let endrowcord = rows * gridSize;
    let endcolcord = cols * gridSize;
    let grid = new Graphics(); 

    
    for(let i=0 ;i <= rows; i++)
    {
        for(let j =0; j <= cols; j++)
        {
            grid.rect(j * gridSize, i * gridSize, gridSize, gridSize).fill('red');
            grid.stroke({ color: 'black', pixelLine: true });
        }
    }

stage.addChild(grid);
}