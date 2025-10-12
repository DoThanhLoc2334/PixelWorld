/// create pixi application

import * as PIXI from "pixi.js";

export async function createPixiApp(container: HTMLDivElement) {
    const app = new PIXI.Application();

    await app.init({
        width: 800,
        height: 600,
        backgroundColor: 0xffffff,
        antialias: true,
    });

    container.appendChild(app.canvas);
    return app;
}
