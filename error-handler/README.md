# CSI402 - Week 6: ERROR RESPONSE AND HANDLER

## week6 ระบบตรวจสอบข้อมูลผู้ใช้งาน (Login API) พร้อมจัดการ Error และออกแบบ Response ด้วย TypeScript
---
## โครงสร้างโปรเจกต์
    - เริ่มมาก็สร้าง โฟลเดอร์ 
    - ติดตั้ง npm init -y, npm i express, npm i --save-dev typescript ts-node nodemon @types/node @types/express
    - สร้างไฟล์ tsconfig ของ ts. npx tsc --init
    - แก้ไขไฟล์ tsconfig
## สร้าง src และ ไฟล์ 
    - index.ts ตั้งค่า Express และรันเซิร์ฟเวอร์ 
    - routes.ts สร้าง Logic API /check-user 
    - model.ts โครงสร้างข้อมูลสำหรับส่ง response
---
## วิธีทดสอบ API /check-user
    - Method: POST
    - URL: http://localhost:3000/check-user

## ตัวอย่างข้อมูลทดสอบ
    - Login สำเร็จ    { "username": "admin", "password": "1234" }
    - ไม่กรอก username   { "password": "1234" }
    - ใส่ username หรือ password ผิด   { "username": "user", "password": "0000" }
