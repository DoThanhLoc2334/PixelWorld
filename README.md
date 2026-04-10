# PixelWorld

PixelWorld la mot ung dung canvas pixel thoi gian thuc, noi nhieu nguoi dung co the to mau len cung mot luoi va thay doi duoc dong bo ngay qua Socket.IO.

## Tinh nang chinh

- Hien thi world dang luoi pixel kich thuoc lon bang `PixiJS`.
- Di chuyen va zoom canvas voi `pixi-viewport`.
- Chon mau tu bang 10 mau co dinh.
- Bat/tat che do ve truc tiep tren giao dien.
- Dong bo thay doi giua nhieu client theo thoi gian thuc bang `Socket.IO`.

## Cong nghe su dung

- Frontend: `React 19`, `TypeScript`, `Vite`
- Rendering: `PixiJS`, `@pixi/react`, `pixi-viewport`
- Realtime: `socket.io-client`
- Backend: `Node.js`, `Express`, `Socket.IO`

## Cau truc project

```text
PixelWorld/
|-- src/
|   |-- components/CanvasView.tsx   # Canvas chinh, xu ly ve va socket
|   |-- App.tsx                     # UI chon mau, bat/tat che do ve
|   |-- main.tsx                    # Entry frontend
|-- public/
|-- Server/
|   |-- server.js                   # Realtime server voi Express + Socket.IO
|   |-- package.json
|-- package.json                    # Cau hinh frontend
```

## Yeu cau moi truong

- `Node.js` 18 tro len
- `npm` 9 tro len

## Cai dat

Cai dependencies cho frontend:

```bash
npm install
```

Cai dependencies cho backend:

```bash
cd Server
npm install
```

## Chay project o moi truong local

Mo 2 terminal rieng.

Terminal 1, chay backend:

```bash
cd Server
npm start
```

Backend se chay tai `http://localhost:3000`.

Terminal 2, chay frontend:

```bash
npm run dev
```

Frontend mac dinh se chay qua Vite, thuong tai `http://localhost:5173`.

## Cach su dung

- Mo ung dung tren trinh duyet.
- Nhan nut cay but o goc phai tren de bat che do ve.
- Chon mau o thanh cong cu goc trai tren.
- Click vao o de to mau.
- Co the giu `Space` va re chuot de to lien tuc tren nhieu o.
- Cac client khac dang ket noi se nhan duoc cap nhat gan nhu ngay lap tuc.

## Cach hoat dong

- Khi client ket noi, server gui toan bo trang thai luoi qua su kien `initGrid`.
- Khi nguoi dung to mot o, frontend phat su kien `cellClick`.
- Server cap nhat du lieu grid trong bo nho va broadcast `updateCell` cho toan bo client.

## Build frontend

```bash
npm run build
```

## Luu y hien tai

- Du lieu grid dang duoc luu trong RAM cua server, nen se mat khi restart backend.
- Frontend hien dang ket noi cung toi `http://localhost:3000`.
- Kich thuoc world hien tai la `500 x 500` o, moi o co kich thuoc `50px`.

## Huong phat trien tiep theo

- Luu grid vao database hoac file de co persistence.
- Them xac thuc nguoi dung va gioi han toc do to mau.
- Cho phep chon kich thuoc brush hoac bang mau dong.
- Tach cau hinh moi truong frontend/backend bang bien moi truong.
