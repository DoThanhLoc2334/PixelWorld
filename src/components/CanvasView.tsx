import { useEffect, useRef } from "react";
import { socket } from "../socket";
import { createPixiApp } from "../pixi";
import { Application, Color, Container, Graphics } from "pixi.js"
import { Viewport } from "pixi-viewport";
import axios from 'axios'

type CanvasViewProps = { selectedColor?: string };
let stage: Viewport;
let getSelectedColor = () => "#1e90ff";
const gridSize = 50;
let cellMap: Graphics[][] = [];

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
            await axios.get('http://localhost:8080').then((response) => {
                grid = response.data;
            });
            for (let i = 0; i < 20; i++) {
                for (let j = 0; j < 20; j++) {
                    let cell = CreateCell(j, i, gridlength, grid[i][j]);
                    stage.addChild(cell);
                }
            }
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

    socket.on("initGrid", (serverGrid) => {
        console.log("Received full grid from server");
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
    });

    // update khi co nguoi doi mau
    socket.on("updateCell", ({ x, y, color }) => {
        const cell = cellMap[y][x];
        if (!cell) return;
        // update cell khi nhan duoc update tu server(co the tu client khac hoac chinh ban than)
        updateCellColor(cell, x, y, color);
    })

    socket.on("serverMessage", (data) => {
        console.log("Message from Server:", data.message);
    });
}

function ensure<T>(argument: T | undefined | null, message: string = 'This value was promised to be there.'): T {
    if (argument === undefined || argument === null) {
        throw new TypeError(message);
    }
    return argument;
}

class cellwrapper extends Graphics {
    indexX: number;
    indexY: number;
    color: number;
    constructor(indexX: number, indexY: number, color:number) {
        super();
        this.indexX = indexX;
        this.indexY = indexY;
        this.color = color;
    }
}

function updateCellColor(cell: Graphics, x: number, y: number, color: string) {
    if (!cell) return;
    cell.clear();
    cell.rect(x * gridSize, y * gridSize, gridSize, gridSize).fill(color);
}


function CreateCell(xindex: number, yindex: number, length: number, color: number) {
    let colorstr = ColorDictionary[color];
    let cell = new cellwrapper(xindex, yindex, color).rect(xindex * length, yindex * length, length, length).fill(colorstr);
    cell.eventMode = 'static';
    cell.cursor = 'pointer';
    cell.on('pointerdown', (eventype) => {
        console.log(eventype.currentTarget);
        let selectedcell = eventype.currentTarget as cellwrapper;
        let x = selectedcell.indexX;
        let y = selectedcell.indexY;
        let postcell ={
            indexX : x,
            indexY: y,
            color: 1
        }
        let postcelljson = JSON.stringify(postcell);
        console.log(postcelljson);
        eventype.currentTarget.destroy();
        axios.post('http://localhost:8080', postcelljson).then(response => {console.log(response)});
        let cell = CreateCell(x, y, gridlength, 1);
        stage.addChild(cell);
    // cell.on('pointerdown', () => {
    //     const newColor = getSelectedColor();
    //      // optimistic update: update ngay lap tuc ma khong can phan hoi tu server
    //     updateCellColor(cell, xindex, yindex, newColor);
    //     // sau khi update thi emit toi server
    //     socket.emit("cellClick", { x: xindex, y: yindex, color: newColor });
    });
    return cell;
}
