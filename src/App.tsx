// App.tsx
import { useState } from "react";
import CanvasView from "./components/CanvasView";

export default function App() {
  const [color, setColor] = useState("#1e90ff");

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {/* Toolbar nổi cố định */}
      <div
        id="pw-toolbar"
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          display: "flex",
          gap: 8,
          padding: 10,
          borderRadius: 8,
          background: "rgba(255,255,255,0.98)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
          zIndex: 2147483647, // ensure toolbar is above canvas
          pointerEvents: 'auto',
          border: '2px solid rgba(0,0,0,0.08)'
        }}
      >
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "sans-serif" }}>Color</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ width: 32, height: 32, border: "none", padding: 0, background: "transparent" }}
          />
        </label>
      </div>

      {/* Truyền màu xuống Canvas */}
      <CanvasView selectedColor={color} />
    </div>
  );
}
