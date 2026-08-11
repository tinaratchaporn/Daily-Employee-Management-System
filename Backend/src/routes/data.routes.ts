import express, { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import Employee from "../models/Employee";
import Leave from "../models/Leave";
import Choosework from "../models/Choosework";
import EmpDetails from "../models/Employee";
import Notifications from "../models/Notifications";

import {
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller";

import {
    createLeaveRequest,
    getLeaveRequests,
    updateLeaveRequest,
} from "../controllers/leave.controller";

import {
    createChoosework,
    getChoosework,
    getChooseworkEmployee,
} from "../controllers/choosework.controller";

import {
    createNotification,
    getNotification,
    updateNotification,
    deleteNotification,
} from "../controllers/notification.controller";

const data = express.Router();
dotenv.config();



// ตัวแปรสำหรับเซ็นต์ JWT (ควรเก็บในไฟล์ .env หรือที่ปลอดภัย)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // ควรเก็บเป็น environment variable

const router = express.Router();

//testttttttttttttttttttt
data.get("/test", (_req: Request, res: Response) => {
  res.send("Router is working");
});

// ดึงข้อมูลพนักงานทั้งหมด
data.get("/getEmployee", getEmployee);

// เพิ่มพนักงานใหม่
data.post("/addEmployee", addEmployee);

// อัปเดตข้อมูลพนักงานตาม ID
data.put("/updateEmployee/:id", updateEmployee);

// ลบพนักงานตาม ID
data.delete("/deleteEmployee/:id", deleteEmployee);

// สร้างคำขอลา
data.post("/createLeaveRequest", createLeaveRequest);

// ดึงคำขอลาที่รออนุมัติ
data.get("/getLeaveRequests", getLeaveRequests);

// // อนุมัติ/ปฏิเสธคำขอลา
// data.post("/approveLeave", approveLeave);

// แก้ไขสถานะคำขอลา
data.put("/updateLeaveRequest/:leaveRequestusername", updateLeaveRequest);

// API สำหรับการส่งข้อมูลการลงงาน (POST)
data.post("/Choosework", createChoosework);

// API สำหรับดึงข้อมูลการลงงาน (GET) for admin
data.get("/getChoosework", getChoosework);

//api get choosework for employee
data.get("/getChooseworkEmployee", getChooseworkEmployee);

// เส้นทาง API สำหรับการสร้างการแจ้งเตือน 
data.post("/createNotification", createNotification);

//api get notification ลงงานไปหาแอดมิน
data.get("/getNotification", getNotification);

// เส้นทาง API สำหรับการอัปเดตสถานะการแจ้งเตือน
data.put("/updateNotification/:id", updateNotification);

//api อัปเดตสถานะการแจ้งเตือนการลงงาน
data.put("/updateNoti/:id", updateNotification);

//api ลบการแจ้งเตือน 
data.delete('/deleteNotification/:id', deleteNotification);
  
//api ดึงชื่อพนักงานและวันทำงาน
  interface Employee {
    username: string;
    name: string;
    department: string;
    hrs: number;
    workday: number;
  }
  
  //api earnings and work days
  data.get("/getempinfoForworkDays", async (req: Request, res: Response) => {
    try {
      // ใช้ lean() เพื่อดึงข้อมูลเป็น plain JavaScript object
      const employees = await EmpDetails.find().lean();
  
      // กรองพนักงานที่มี role เป็น 'admin'
      const filteredEmployees = employees.filter((employee: any) => employee.role !== 'admin');
  
      // map ข้อมูลที่ได้ให้ตรงกับประเภท Employee
      const employeeData = filteredEmployees.map((employee: any) => {  // ใช้ 'any' หรือ 'Document<any>'
        // ตรวจสอบและแปลง 'hrs' และ 'workday' ให้เป็นตัวเลข
        const totalHours = typeof employee.hrs === 'string' ? parseFloat(employee.hrs) : employee.hrs;
        const totalDays = typeof employee.workday === 'string' ? parseInt(employee.workday) : employee.workday;
  
        // คำนวณเงินจากชั่วโมงที่ทำงาน (hrs * 60 บาทต่อชั่วโมง)
        const earnings = (totalDays * 420) ;
  
        return {
          username: employee.username,
          name: employee.name,
          department: employee.department,
          hrs: totalHours,
          workday: totalDays,
          earnings: earnings.toFixed(1), // เงินที่ได้รับ
        };
      });
  
      // ส่งข้อมูลออกไป
      res.json({ success: true, data: employeeData });
    } catch (error) {
      console.error("Error fetching employee work info:", error);
      res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
  });
  
export default data;
