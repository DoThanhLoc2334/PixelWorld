// Component React show canvas and manage Pixi App"

import { useEffect, useRef } from "react";
import { createPixiApp } from "../pixi";
import { Application, Container, Graphics } from "pixi.js"
let stage = new Container();
const gridlength = 50;
export default function CanvasView() {
    const canvasRef = useRef<HTMLDivElement>(null);
    let stage = new Container();
    let cell = new Graphics().rect(500, 50, 50, 50).fill('red');
    useEffect(() => {
        if (!canvasRef.current) return;

        let app: Application;

        (async () => {
            app = await createPixiApp(canvasRef.current!);
            stage.addChild(cell);
            app.stage.addChild(stage);
        })();
        

        console.log("Fired");

        return () => {
            if (app) {
                app.destroy(true, { children: true });
                app.canvas.remove();
            }
        };
    }, []);

    return (<div ref={canvasRef} style={{ width: "100%", height: "100%" }}>
        
    </div>
    );
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
        eventype.currentTarget.destroy();
        let cell = CreateCell(x, y, gridlength, 'blue');
        stage.addChild(cell);
    });
    return cell;
}
