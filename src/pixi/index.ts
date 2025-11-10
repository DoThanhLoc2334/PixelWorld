/// create pixi application
import * as PIXI from "pixi.js";
export async function createPixiApp(container: HTMLDivElement) {
    container.querySelectorAll("canvas").forEach(c => c.remove());

    const app = new PIXI.Application();
    await app.init({
        antialias: true,
        backgroundColor: 0xffffff,
        resizeTo: window,
    });

    container.appendChild(app.canvas);
    // Ensure canvas stays behind UI overlays (toolbars) and fills the container
    app.canvas.style.position = 'absolute';
    app.canvas.style.top = '0';
    app.canvas.style.left = '0';
    app.canvas.style.width = '100%';
    app.canvas.style.height = '100%';
    app.canvas.style.zIndex = '0';

    return app;
}
