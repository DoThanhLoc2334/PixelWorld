/// create pixi application

import * as PIXI from "pixi.js";
// import {Graphics} from 'pixi.js'


export async function createPixiApp(container: HTMLDivElement) {
    container.querySelectorAll("canvas").forEach(c => c.remove());

    const app = new PIXI.Application();
    await app.init({
        width: 1920,
        height: 1080,
        backgroundColor: 0xffffff,
        antialias: true,
    });


    container.appendChild(app.canvas);
    return app;
}
