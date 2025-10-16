/// create pixi application

import * as PIXI from "pixi.js";
import {Graphics} from 'pixi.js'


export async function createPixiApp(container: HTMLDivElement) {
    const app = new PIXI.Application();
    await app.init({
        width: 1920,
        height: 1080,
        backgroundColor: 0xffffff,
        antialias: true,
    });

    let cell = new Graphics().rect(0,0,50,50).fill('red');
    container.appendChild(app.canvas);
    return app;
}
