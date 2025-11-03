// Component React show canvas and manage Pixi App"

import { useEffect, useRef } from "react";
import { createPixiApp } from "../pixi";
import { Application, Container, Graphics } from "pixi.js"
import { Viewport } from "pixi-viewport";


let stage: Viewport;

const gridlength = 50;
export default function CanvasView() {
    const canvasRef = useRef<HTMLDivElement>(null);


    let emptygrid = new Array(20);

    emptygrid.forEach((element) => { element = new Array(20) });


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




            for (let i = 0; i < 20; i++) {
                for (let j = 0; j < 20; j++) {
                    let cell = CreateCell(j, i, gridlength, 'red');
                    stage.addChild(cell);
                }
            }


            //stage.addChild(cell);
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
