# FlashGen
Final project วิชา i2cedt กลุ่ม 19 ตึงๆ

## Deploy
ถ้าอยาก deploy ให้รัน `npm install` ก่อน จากนั้นให้เพิ่ม `.env` ใน `/backend` แล้วเขียน
```
GEMINI_API_KEY=...
MONGO_URI=...
AUTH_TOKEN_KEY=CEDTcriossant019
```
ข้างในไฟล์ แล้วก็แก้ `IP` ใน `start.sh` เป็น IPv4 ของ ec2 (หรือปล่อยไว้เป็น localhost นั้นถ้าจะรันบน local) จากนั้นรัน `./start.sh` ได้เลย

## เพิ่มเติม
เนื่องจากงานไม่ได้ให้ freedom เราในการใช้ package อะไรก็ได้จาก npm ทำให้ระบบ auth หรือ security ต้อง DIY ขึ้นมาเองจ้า