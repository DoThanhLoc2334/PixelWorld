// Component React show canvas and manage Pixi App"

import { useEffect, useRef } from "react";
import { createPixiApp } from "../pixi";

export default function CanvasView()
{
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(()=> {
        if(!canvasRef.current) 
            return;
        const app = createPixiApp(canvasRef.current);

        return () => {
            app.destroy(true, { children: true });
        };
    }, []);

    return <div ref={canvasRef} style={{ width: "100%", height: "100%"}} />;
}