import { useEffect, useRef } from "react";
import {socket} from "../../server/socket";
import { createPixiApp } from "../pixi";
import { Application, Color, Container, Graphics } from "pixi.js"
import { Viewport } from "pixi-viewport";
import axios from 'axios'

type CanvasViewProps = { selectedColor?: string };

let stage: Viewport;

let getSelectedColor = () => "#1e90ff";

let ColorDictionary = Array();
ColorDictionary.push('red');
ColorDictionary.push('blue');
const gridlength = 50;
export default function CanvasView({ selectedColor = "#1e90ff" }: CanvasViewProps) {
    const canvasRef = useRef<HTMLDivElement>(null);

    getSelectedColor = () => selectedColor;

    useEffect(() => {
        // Socket event listeners
        socket.on("connect", () => {
            console.log("Connected to PixelWord!");
        });

        socket.on("disconnect", () => {
            console.log("Server disconnected");
        });

        socket.on("serverMessage", (data) => {
            console.log("Message from Server:", data.message);
        });

        // Connect to server if not already connected
        if (!socket.connected) {
            socket.connect();
        }

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
            await axios.get('http://localhost:8080').then((response) => {
                grid = response.data;
            });
            for (let i = 0; i < 20; i++) {
                for (let j = 0; j < 20; j++) {
                    let cell = CreateCell(j, i, gridlength, ColorDictionary[grid[i][j]]);
                    stage.addChild(cell);
                }
            }
            app.stage.addChild(stage);
        })();
        

        console.log("Fired");

        // Cleanup function - runs when component unmounts
        return () => {
            // Remove socket listeners
            socket.off("connect");
            socket.off("disconnect");
            
            // Cleanup Pixi app
            if (app) {
                app.destroy(true, { children: true });
                app.canvas.remove();
            }
        };
    }, []);

    return (<div ref={canvasRef} style={{ width: "100%", height: "100%" }}>
    </div>);
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

    constructor(indexX: number, indexY: number) {
        super();
        this.indexX = indexX;
        this.indexY = indexY;
    }
}

function CreateCell(xindex: number, yindex: number, length: number, color: string) {
    let cell = new cellwrapper(xindex, yindex).rect(xindex * length, yindex * length, length, length).fill(color);
    cell.eventMode = 'static';
    cell.cursor = 'pointer';
    cell.on('pointerdown', (eventype) => {
        console.log(eventype.currentTarget);
        let selectedcell = eventype.currentTarget as cellwrapper;
        let x = selectedcell.indexX;
        let y = selectedcell.indexY;

        socket.emit("cellClick", {x, y});

        eventype.currentTarget.destroy();
        axios.post('http://localhost:8080', 'hello').then(response => {console.log(response)});
        let cell = CreateCell(x, y, gridlength, getSelectedColor());
        stage.addChild(cell);
    });
    return cell;
}
