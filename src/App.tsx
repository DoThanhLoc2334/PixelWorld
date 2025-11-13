// App.tsx
import { useState } from "react";
import CanvasView from "./components/CanvasView";

// 10 màu cố định
const FIXED_COLORS = [
  "#1e90ff", // xanh dương
  "#ff4757", // đỏ
  "#2ed573", // xanh lá
  "#ffa502", // cam
  "#3742fa", // xanh đậm
  "#e84393", // hồng
  "#70a1ff", // xanh nhạt
  "#5352ed", // tím
  "#747d8c", // xám
  "#ffffff", // trắng
];

export default function App() {
  const [selectedIndex, setSelectedIndex] = useState(0); // index màu
  const currentColor = FIXED_COLORS[selectedIndex];

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
          zIndex: 2147483647,
          pointerEvents: "auto",
          border: "2px solid rgba(0,0,0,0.08)",
        }}
      >
        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: 14,
            marginRight: 4,
            alignSelf: "center",
          }}
        >
          Color
        </span>

        {/* Dãy 10 ô màu */}
        {FIXED_COLORS.map((c, idx) => (
          <button
            key={c}
            onClick={() => setSelectedIndex(idx)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border:
                idx === selectedIndex
                  ? "3px solid rgba(0,0,0,0.8)"
                  : "1px solid rgba(0,0,0,0.2)",
              background: c,
              padding: 0,
              cursor: "pointer",
              outline: "none",
            }}
          />
        ))}
      </div>

      {/* Truyền màu hiện tại xuống Canvas */}
      <CanvasView selectedColor={currentColor} />
    </div>
  );
}
