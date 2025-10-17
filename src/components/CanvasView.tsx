// Component React show canvas and manage Pixi App"

import { useEffect, useRef } from "react";
import { createPixiApp } from "../pixi";
import { Application, Container, Graphics} from "pixi.js" 

export default function CanvasView() {
    const canvasRef = useRef<HTMLDivElement>(null);
    let stage = new Container();
    let cell = new Graphics().rect(500,50, 50, 50).fill('red');
    useEffect(() => {
        if (!canvasRef.current) return;
        
        let app : Application;
        
        (async () => {
            app = await createPixiApp(canvasRef.current!);
            stage.addChild(cell);
            app.stage.addChild(stage);
        })();

        

        return () => {
            if (app) app.destroy(true, { children: true });
        };
    }, []);

    return <div ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}
