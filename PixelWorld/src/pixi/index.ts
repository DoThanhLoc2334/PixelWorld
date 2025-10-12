/// create pixi application

import * as PIXI from 'pixi.js';

export function createPixiApp(container: HTMLDivElement)
{
    const app = new PIXI.Application({
        width: 800,
        height: 600,
        backgroundColor: 0xffffff,
        antialias: true,
    });

    container.appendChild(app.view as HTMLCanvasElement);
    return app;
}