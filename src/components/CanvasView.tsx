// Component React show canvas and manage Pixi App"

import { useEffect, useRef } from "react";
import { createPixiApp } from "../pixi";
import 'pixi.js'
import { Application, Graphics } from "pixi.js";




export default function CanvasView()
{
    const canvasRef = useRef<HTMLDivElement>(null);
        let cell = new Graphics().rect(0,0,50,50).fill('red');
    useEffect(() => {
        if (!canvasRef.current) return;

        let app : Application;
        (async () => {
            app = await createPixiApp(canvasRef.current!);
        })();
        

        return () => {
            if (app) app.destroy(true, { children: true });
            app.canvas.remove();
        };
    }, []);

    return (<div ref={canvasRef} style={{ width: "100%", height: "100%" }}>
        
    </div>
    );
}

