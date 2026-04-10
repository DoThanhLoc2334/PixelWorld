# PixelWorld

PixelWorld là một ứng dụng canvas pixel thời gian thực, nơi nhiều người dùng có thể tô màu lên cùng một lưới và thấy thay đổi được đồng bộ ngay qua Socket.IO.

## Tính năng chính

- Hiển thị world dạng lưới pixel kích thước lớn bằng `PixiJS`.
- Di chuyển và zoom canvas với `pixi-viewport`.
- Chọn màu từ bảng 10 màu cố định.
- Bật/tắt chế độ vẽ trực tiếp trên giao diện.
- Đồng bộ thay đổi giữa nhiều client theo thời gian thực bằng `Socket.IO`.

## Công nghệ sử dụng

- Frontend: `React 19`, `TypeScript`, `Vite`
- Rendering: `PixiJS`, `@pixi/react`, `pixi-viewport`
- Realtime: `socket.io-client`
- Backend: `Node.js`, `Express`, `Socket.IO`

## Cấu trúc project

```text
PixelWorld/
|-- src/
|   |-- components/CanvasView.tsx   # Canvas chính, xử lý vẽ và socket
|   |-- App.tsx                     # UI chọn màu, bật/tắt chế độ vẽ
|   |-- main.tsx                    # Entry frontend
|-- public/
|-- Server/
|   |-- server.js                   # Realtime server với Express + Socket.IO
|   |-- package.json
|-- package.json                    # Cấu hình frontend
```

## Yêu cầu môi trường

- `Node.js` 18 trở lên
- `npm` 9 trở lên

## Cài đặt

Cài dependencies cho frontend:

```bash
npm install
```

Cài dependencies cho backend:

```bash
cd Server
npm install
```

## Chạy project ở môi trường local

Mở 2 terminal riêng.

Terminal 1, chạy backend:

```bash
cd Server
npm start
```

Backend sẽ chạy tại `http://localhost:3000`.

Terminal 2, chạy frontend:

```bash
npm run dev
```

Frontend mặc định sẽ chạy qua Vite, thường tại `http://localhost:5173`.

## Cách sử dụng

- Mở ứng dụng trên trình duyệt.
- Nhấn nút cây bút ở góc phải trên để bật chế độ vẽ.
- Chọn màu ở thanh công cụ góc trái trên.
- Click vào ô để tô màu.
- Có thể giữ `Space` và rê chuột để tô liên tục trên nhiều ô.
- Các client khác đang kết nối sẽ nhận được cập nhật gần như ngay lập tức.

## Cách hoạt động

- Khi client kết nối, server gửi toàn bộ trạng thái lưới qua sự kiện `initGrid`.
- Khi người dùng tô một ô, frontend phát sự kiện `cellClick`.
- Server cập nhật dữ liệu grid trong bộ nhớ và broadcast `updateCell` cho toàn bộ client.

## Build frontend

```bash
npm run build
```

## Lưu ý hiện tại

- Dữ liệu grid đang được lưu trong RAM của server, nên sẽ mất khi restart backend.
- Frontend hiện đang kết nối cứng tới `http://localhost:3000`.
- Kích thước world hiện tại là `500 x 500` ô, mỗi ô có kích thước `50px`.

## Hướng phát triển tiếp theo

- Lưu grid vào database hoặc file để có persistence.
- Thêm xác thực người dùng và giới hạn tốc độ tô màu.
- Cho phép chọn kích thước brush hoặc bảng màu động.
- Tách cấu hình môi trường frontend/backend bằng biến môi trường.
