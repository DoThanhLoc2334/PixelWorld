/// create pixi application

import * as PIXI from "pixi.js";
import { Viewport } from "pixi-viewport";


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
    // Ensure canvas stays behind UI overlays (toolbars) and fills the container
    app.canvas.style.position = 'absolute';
    app.canvas.style.top = '0';
    app.canvas.style.left = '0';
    app.canvas.style.width = '100%';
    app.canvas.style.height = '100%';
    app.canvas.style.zIndex = '0';

    // const viewport = new Viewport({
    //     screenWidth: app.renderer.width,
    //     screenHeight: app.renderer.height,
    //     worldWidth: 5000,
    //     worldHeight: 5000,
    //     events: app.renderer.events,
    // });

    // // ensure viewport matches current screen size
    // viewport.resize(app.screen.width, app.screen.height);

    // app.stage.addChild(viewport);

    // viewport.drag()
    // viewport.pinch()
    // viewport.wheel()
    // viewport.decelerate();

    // const redBox = new PIXI.Graphics().rect(100, 100, 200, 200).fill('red');
    // const greenBox = new PIXI.Graphics().rect(1000, 1000, 300, 300).fill('green');
    // viewport.addChild(redBox, greenBox);


    return app;
}
