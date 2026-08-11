import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Employee from "../models/Employee";

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.error("JWT_SECRET is missing");
      return res.status(500).json({
        error: "ไม่พบการตั้งค่า JWT_SECRET ใน Backend",
      });
    }

    if (!username || !password) {
      return res.status(400).json({
        error: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน",
      });
    }

    const user = await Employee.findOne({ username });

    if (!user) {
      return res.status(401).json({
        error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({
        error: "บัญชีถูกปิดการใช้งาน",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password as string
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token,
      user: {
        userId: user.userId,
        username: user.username,
        role: user.role,
        department: user.department,
        phone: user.phone,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์",
    });
  }
};