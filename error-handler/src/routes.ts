import { Router, Request, Response } from "express";

// interface ApiResponse จากไฟล์ model.ts ซึ่งใช้กำหนดโครงสร้างของข้อมูลที่จะส่งกลับไปยังผู้ใช้ code, status และ message
import { ApiResponse } from "./model";

const router = Router();

// สร้าง interface ระบุชนิดของข้อมูลใน req.body ที่ API นี้ ได้รับเข้ามา username และ password ทั้งสองต้องเป็น string
interface LoginRequestBody {
  username: string;
  password: string;
}

// กำหนดให้ path /check-user รับคำขอแบบ POST โดยใช้ generic Request<{}, {}, LoginRequestBody> เพื่อให้ TypeScript เข้าใจว่า req.body ต้องมี username และ password
router.post("/check-user", (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
  // ใช้ try เพื่อจับข้อผิดพลาดทั้งหมดที่อาจเกิดในกระบวนการและทำการ destructure ข้อมูล username กับ password จาก req.body
  try {
    const { username, password } = req.body;

    // ตรวจสอบว่าผู้ใช้ส่ง username มาหรือไม่ถ้าไม่ส่ง ให้สร้าง response พร้อม code "Error-01" และสถานะ 400 Bad Request พร้อมข้อความ error
    if (!username) {
      const response: ApiResponse = {
        code: "Error-01",
        status: "Failed",
        message: { error: "Missing username" }
      };
      return res.status(400).json(response);
    }

    // ถ้าส่ง username หรือ password ไม่ตรงกับที่กำหนด (admin:1234)ให้ส่ง response ว่า login ผิด พร้อม code "Error-02" และสถานะ 401 Unauthorized
    if (username !== "admin" || password !== "1234") {
      const response: ApiResponse = {
        code: "Error-02",
        status: "Failed",
        message: { error: "Invalid credentials" }
      };
      return res.status(401).json(response);
    }
    
    // ถ้าข้อมูลถูกต้อง ให้สร้าง response ที่บอกว่า login สำเร็จส่งกลับ code "Success-01" และสถานะ 200 OK พร้อมชื่อผู้ใช้
    const response: ApiResponse = {
      code: "Success-01",
      status: "Success",
      message: { username: "admin" }
    };
    return res.status(200).json(response);

    //  ถ้ามีข้อผิดพลาดเกิดขึ้นใน try เช่น ระบบล่มหรือโค้ดพังจะเข้าสู่ catch และส่ง response error แบบ 500 Internal Server Error พร้อม code "Error-9999"
  } catch (error) {
    const response: ApiResponse = {
      code: "Error-9999",
      status: "Failed",
      message: { error: "Internal Server Error" }
    };
    return res.status(500).json(response);
  }
});

export default router;