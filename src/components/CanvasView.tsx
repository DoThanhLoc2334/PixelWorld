// Component React show canvas and manage Pixi App

import { useEffect, useRef } from "react";
import { createPixiApp } from "../pixi";
import { Application, Graphics } from "pixi.js";
import { Viewport } from "pixi-viewport";

type CanvasViewProps = {
  /** Màu hiện tại do người dùng chọn từ App */
  selectedColor?: string;
};

let stage: Viewport;

const gridlength = 50;

export default function CanvasView({ selectedColor = "#1e90ff" }: CanvasViewProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  // ref giữ màu hiện tại để handler trong Pixi luôn đọc được màu mới mà không cần recreate app
  const colorRef = useRef<string>(selectedColor);

  // cập nhật colorRef khi prop đổi
  useEffect(() => {
    colorRef.current = selectedColor;
  }, [selectedColor]);

  let emptygrid = new Array(20);
  emptygrid.forEach((element) => {
    element = new Array(20);
  });

  useEffect(() => {
    if (!canvasRef.current) return;

    let app: Application;

    (async () => {
      app = await createPixiApp(canvasRef.current!);

      stage = new Viewport({
        screenWidth: app.renderer.width,
        screenHeight: app.renderer.height,
        worldWidth: 5000,
        worldHeight: 5000,
        events: app.renderer.events,
      });

      stage.resize(app.screen.width, app.screen.height);
      app.stage.addChild(stage);

      stage.drag();
      stage.pinch();
      stage.wheel();
      stage.decelerate();

      // Vẽ grid 20x20 ô màu đỏ ban đầu. Pass một getter để handler luôn đọc colorRef.current
      const getColor = () => colorRef.current;
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          let cell = CreateCell(j, i, gridlength, "red", getColor);
          stage.addChild(cell);
        }
      }

      app.stage.addChild(stage);
    })();

    console.log("Fired");

    return () => {
      if (app) {
        app.destroy(true, { children: true });
        app.canvas.remove();
      }
    };
  }, []); // chỉ khởi tạo Pixi app 1 lần

  return <div ref={canvasRef} style={{ width: "100%", height: "100%", position: 'relative' }} />;
}

function ensure<T>(
  argument: T | undefined | null,
  message: string = "This value was promised to be there.",
): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }
  return argument;
}

class cellwrapper extends Graphics {
  indexX: number;
  indexY: number;

  constructor(indexX: number, indexY: number) {
    super();
    this.indexX = indexX;
    this.indexY = indexY;
  }
}

/**
 * Tạo 1 ô (cell) và gắn sự kiện click để tô màu được chọn
 * @param xindex cột
 * @param yindex hàng
 * @param length kích thước ô
 * @param color màu khởi tạo của ô
 * @param getColor getter trả về màu hiện tại (đọc từ ref trong component)
 */
function CreateCell(
  xindex: number,
  yindex: number,
  length: number,
  color: string,
  getColor: () => string,
) {
  let cell = new cellwrapper(xindex, yindex).rect(xindex * length, yindex * length, length, length).fill(color);
  cell.eventMode = "static";
  cell.cursor = "pointer";

  cell.on("pointerdown", (eventype: any) => {
    // Lấy ra toạ độ ô hiện tại
    let selectedcell = eventype.currentTarget as cellwrapper;
    let x = selectedcell.indexX;
    let y = selectedcell.indexY;

    // Xoá ô cũ và vẽ lại bằng màu đang chọn (lấy từ getter)
    eventype.currentTarget.destroy();
    const colorNow = getColor();
    let newCell = CreateCell(x, y, gridlength, colorNow, getColor);
    stage.addChild(newCell);
  });

  return cell;
}
