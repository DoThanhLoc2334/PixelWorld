// Component React show canvas and manage Pixi App"

import { useEffect, useRef } from "react";
import { createPixiApp } from "../pixi";
import { Application, Container, Graphics, State } from "pixi.js"

export default function CanvasView() {
    const canvasRef = useRef<HTMLDivElement>(null);
    let stage = new Container();
    let cell = new Graphics().rect(500, 50, 50, 50).fill('red');
    let emptygrid = new Array(20);
    emptygrid.forEach((element) => { element = new Array(20) });
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            let cell = new Graphics().rect(j * 50, i * 50, 50, 50).fill('red');
            stage.addChild(cell);
        }
    }

    useEffect(() => {
        if (!canvasRef.current) return;

        let app: Application;

        (async () => {
            app = await createPixiApp(canvasRef.current!);
            //stage.addChild(cell);
            app.stage.addChild(stage);
        })();

        console.log("Fired");

        return () => {
            if (app) app.destroy(true, { children: true });
        };
    }, []);

    return <div ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}
function ensure<T>(argument: T | undefined | null, message: string = 'This value was promised to be there.'): T {
    if (argument === undefined || argument === null) {
        throw new TypeError(message);
    }

    return argument;
}
