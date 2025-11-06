// CanvasView.tsx
import { useEffect, useRef } from "react";
import { socket } from "../../server/socket";
import { createPixiApp } from "../pixi";
import { Application, Graphics } from "pixi.js";
import { Viewport } from "pixi-viewport";

type CanvasViewProps = {
  /** Màu hiện tại do người dùng chọn từ App (dạng "#RRGGBB") */
  selectedColor?: string;
};

const GRID_LENGTH = 50;
const GRID_W = 20;
const GRID_H = 20;

/** Chuyển "#RRGGBB" -> 0xRRGGBB cho Pixi */
const cssToPixi = (css: string) => Number(`0x${css.replace("#", "")}`);

class CellGraphic extends Graphics {
  ix: number;
  iy: number;
  len: number;

  constructor(ix: number, iy: number, len: number, color: number) {
    super();
    this.ix = ix;
    this.iy = iy;
    this.len = len;
    this.eventMode = "static";
    this.cursor = "pointer";
    this.draw(color);
  }

  draw(color: number) {
    const x = this.ix * this.len;
    const y = this.iy * this.len;
    this.clear();
    this.rect(x, y, this.len, this.len).fill(color);
  }
}

export default function CanvasView({ selectedColor = "#1e90ff" }: CanvasViewProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Giữ màu hiện tại để handler trong Pixi luôn đọc được (không cần recreate app)
  const colorRef = useRef<string>(selectedColor);
  useEffect(() => {
    colorRef.current = selectedColor;
  }, [selectedColor]);

  // Tham chiếu App & Viewport để cleanup
  const appRef = useRef<Application | null>(null);
  const viewportRef = useRef<Viewport | null>(null);

  useEffect(() => {
    // --- Socket ---
    const onConnect = () => console.log("Connected to PixelWord!");
    const onDisconnect = () => console.log("Server disconnected");
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    if (!socket.connected) socket.connect();

    // --- Pixi Setup ---
    if (!mountRef.current) return;

    let destroyed = false;
    (async () => {
      const app = await createPixiApp(mountRef.current!);
      appRef.current = app;

      // Nền renderer nếu muốn (bật nếu cần toàn nền canvas đỏ):
      // app.renderer.background.color = 0x000000; // ví dụ đen
      // app.renderer.background.alpha = 1;

      const viewport = new Viewport({
        screenWidth: app.renderer.width,
        screenHeight: app.renderer.height,
        worldWidth: GRID_W * GRID_LENGTH,
        worldHeight: GRID_H * GRID_LENGTH,
        events: app.renderer.events,
      });
      viewportRef.current = viewport;

      viewport.drag().pinch().wheel().decelerate();
      app.stage.addChild(viewport);

      // KHỞI TẠO Ô = ĐỎ (giữ đỏ như ban đầu)
      const INIT_RED = 0xff0000;
      for (let y = 0; y < GRID_H; y++) {
        for (let x = 0; x < GRID_W; x++) {
          const cell = new CellGraphic(x, y, GRID_LENGTH, INIT_RED);
          // Click -> tô lại ô bằng màu đang chọn
          cell.on("pointerdown", () => cell.draw(cssToPixi(colorRef.current)));
          viewport.addChild(cell);
        }
      }

      // Resize handler
      const onResize = () => {
        if (!appRef.current || !viewportRef.current) return;
        const parent = mountRef.current!;
        const w = parent.clientWidth || window.innerWidth;
        const h = parent.clientHeight || window.innerHeight;
        appRef.current.renderer.resize(w, h);
        viewportRef.current.resize(w, h);
      };

      // Lần đầu & lắng nghe resize
      onResize();
      window.addEventListener("resize", onResize);

      // Cleanup nội bộ async
      const cleanup = () => {
        window.removeEventListener("resize", onResize);
        if (appRef.current) {
          // Hủy cả cây stage
          appRef.current.destroy(true, { children: true });
          // Gỡ <canvas> nếu createPixiApp gắn vào DOM
          (appRef.current as any).canvas?.remove?.();
        }
        appRef.current = null;
        viewportRef.current = null;
      };

      if (destroyed) cleanup();
      else (appRef.current as any)._cleanup = cleanup;
    })();

    // --- Cleanup tổng ---
    return () => {
      destroyed = true;
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      // Hủy Pixi (nếu đã khởi tạo)
      (appRef.current as any)?._cleanup?.();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: "100%",
        // Nếu muốn một màu nền CSS ngoài lưới (không ảnh hưởng ô): bật dòng dưới
        // background: "#ff0000",
      }}
    />
  );
}
