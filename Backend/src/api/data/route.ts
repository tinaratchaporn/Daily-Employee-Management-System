import express, { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'; // ใช้ bcryptjs แทน bcrypt
import Employee from "../../models/Employee";
import Leave from "../../models/Leave";
import Choosework from "../../models/Choosework";
import EmpDetails from "../../models/Employee";
import Notifications from "../../models/Notifications";

const data = express.Router();
dotenv.config();



// ตัวแปรสำหรับเซ็นต์ JWT (ควรเก็บในไฟล์ .env หรือที่ปลอดภัย)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // ควรเก็บเป็น environment variable

const router = express.Router();

//testttttttttttttttttttt
data.get("/test", (_req: Request, res: Response) => {
  res.send("Router is working");
});

// ฟังก์ชันตรวจสอบความถูกต้องของหมายเลขบัตรประชาชนไทย
const isValidThaiID = (id: string): boolean => {
    const regex = /^\d{13}$/;
    return regex.test(id);
};

// ดึงข้อมูลพนักงานทั้งหมด
data.get("/getEmployee", async (_req: Request, res: Response) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        console.error("Error retrieving employees:", err);
        res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
});

// เพิ่มพนักงานใหม่
data.post("/addEmployee", async (req: Request, res: Response) => {
    const { userId, name, department, phone, email } = req.body;

    if (!userId || !name || !department || !phone || !email) {
        return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    if (!isValidThaiID(userId)) {
        return res.status(400).json({ error: "หมายเลขบัตรประชาชนไม่ถูกต้อง" });
    }

    try {
        await Employee.create({ userId, name, department, phone, email });
        const newEmployee = await Employee.find();
        res.status(201).json(newEmployee);
    } catch (err) {
        console.error("Error adding employee:", err);
        res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
});

// อัปเดตข้อมูลพนักงานตาม ID
data.put("/updateEmployee/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId, name, department, phone, email } = req.body;

    if (!userId || !name || !department || !phone || !email) {
        return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    if (!isValidThaiID(userId)) {
        return res.status(400).json({ error: "หมายเลขบัตรประชาชนไม่ถูกต้อง" });
    }

    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(id, { userId, name, department, phone, email }, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ error: "ไม่พบพนักงานที่ต้องการแก้ไข" });
        }

        res.status(200).json(updatedEmployee);
    } catch (err) {
        console.error("Error updating employee:", err);
        res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
});

// ลบพนักงานตาม ID
data.delete("/deleteEmployee/:id", async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee) {
            return res.status(404).json({ error: "ไม่พบพนักงานที่ต้องการลบ" });
        }

        res.status(200).json({ message: "พนักงานถูกลบเรียบร้อยแล้ว", deletedEmployee });
    } catch (err) {
        console.error("Error deleting employee:", err);
        res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
});

// Route สำหรับ Login
data.post("/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
  
      // ตรวจสอบว่า username หรือ password ไม่มีค่าว่าง
      if (!username || !password) {
        return res.status(400).json({ error: "กรุณากรอกชื่อผู้ใช้และรหัสผ่าน" });
      }
  
      // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
      const user = await Employee.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: "ชื่อผู้ใช้ไม่ถูกต้อง" });
      }
  
      // ตรวจสอบรหัสผ่านที่ผู้ใช้กรอก
        const isPasswordValid = await Employee.findOne({ username, password });
        if (!isPasswordValid) {
            return res.status(401).json({ error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }
    
      // สร้าง JWT token และส่งกลับไป
      const token = jwt.sign(
        { userId: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.status(200).json({
        message: "เข้าสู่ระบบสำเร็จ",
        token,
        user: { username: user.username, 
            role: user.role,
             department: user.department,
            phone: user.phone,
            email: user.email }
      });
    } catch (err) {
      console.error("Error logging in:", err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
  });

//api ส่งแบบฟอร์มลา
data.post("/createLeaveRequest", async (req: Request, res: Response) => {
    const { username, reason, date, type, status } = req.body;
    console.log("Received Data:", req.body); // ตรวจสอบข้อมูลที่ได้รับจาก client
  
    try {
      if (!username || !reason || !date || !type) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
      }
  
      // สร้างคำขอลาใหม่ในฐานข้อมูล
      const newLeaveRequest = new Leave({
        username,
        reason,
        date,
        type,
        status: status || "Pending",
      });
  
      // บันทึกคำขอลงฐานข้อมูล
      await newLeaveRequest.save();
  
      res.json({ success: true, message: "Leave request created successfully" });
    } catch (err) {
      console.error("Error creating leave request:", err);
      res.status(500).json({ success: false, message: "Error creating leave request" });
    }
  });
  

// API สำหรับการส่งข้อมูลการลงงาน (POST)
data.post("/Choosework", async (req: Request, res: Response) => {
    const { userId, username, department, task, status, date } = req.body;
  
    if (!username || !department || !task || !date) {
      return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }
  
    try {
      const newwork = new Choosework({ userId, username, department, task, status, date });
      console.log(newwork); 
      await newwork.save();
      res.status(200).json({ message: "ลงงานสำเร็จ" });
    } catch (err) {
      console.error("Error logging in:", err);
      res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
  });
  
  // API สำหรับดึงข้อมูลการลงงาน (GET) for admin
 data.get("/getChoosework", async (req: Request, res: Response) => {
  const { userId, department } = req.query;
  
  try {
    // ดึงข้อมูลการลงงานโดยกรองตาม userId หรือ department หากมีการส่งค่า
    const filter: any = {};
    if (userId) filter.userId = userId;
    if (department) filter.department = department;

    const works = await Choosework.find(filter); // ใช้ตัวกรองถ้ามี
    res.status(200).json(works); // ส่งข้อมูลไปยังผู้ใช้
  } catch (err) {
    console.error("Error fetching work schedules:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
});
  
//api get choosework for employee
data.get("/getChooseworkEmployee", async (req: Request, res: Response) => {
    try {
      const works = await Choosework.find({ username: req.query.username });
      res.status(200).json(works);
    } catch (err) {
      console.error("Error fetching employee work info:", err);
      res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
    }
  });

// API สำหรับดึงคำขอลางานที่รอดำเนินการ
data.get("/getLeaveRequests", async (req: Request, res: Response) => {
    try {
      const leaveRequests = await Leave.find({ status: "Pending" });
      res.status(200).json(leaveRequests);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลคำขอลางานได้" });
    }
  });
  
// API สำหรับการอนุมัติหรือปฏิเสธคำขอลา
data.post("/approveLeave", async (req: Request, res: Response) => {
    const { username, status } = req.body;
  
    if (!username || !status) {
      return res.status(400).json({ message: "Missing username or status" });
    }
  
    try {
      // ค้นหาคำขอลาโดยใช้ username และสถานะ "Pending"
      const result = await Leave.updateOne(
        { username: username, status: "Pending" },  // ค้นหาตาม username และสถานะ "Pending"
        { $set: { status: status } }  // อัปเดตสถานะเป็น "Approved"
      );
  
      if (result.modifiedCount > 0) {
        res.json({ message: "Leave request approved" });
      } else {
        res.json({ message: "No pending leave request found for this username" });
      }
    } catch (err) {
      console.error("Error approving leave:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // API สำหรับการอัปเดตสถานะคำขอลา 
  data.put("/updateLeaveRequest/:leaveRequestusername", async (req, res) => {
    try {
      const { leaveRequestusername } = req.params;
      const { status } = req.body;
  
      // ตรวจสอบว่า ID มีในฐานข้อมูล
      const updatedRequest = await Leave.findByIdAndUpdate(
        leaveRequestusername,
        { status },
        { new: true }
      );
  
      if (!updatedRequest) {
        return res.status(404).json({ success: false, message: "Leave request not found" });
      }
  
      res.status(200).json({ success: true, request: updatedRequest });
    } catch (error) {
      console.error("Error updating leave request:", error);
      res.status(500).json({ success: false, message: "Failed to update leave request" });
    }
  });
  
  
  // เส้นทาง API สำหรับการสร้างการแจ้งเตือน 
  data.post("/createNotification", async (req, res) => {
    try {
      const { username, date, type, status, reason } = req.body;
      const newNotification = new Notifications({
        username,
        date,
        type,
        status,
        reason,  // ตรวจสอบให้แน่ใจว่า 'reason' ถูกส่งมา
      });
  
      await newNotification.save();
  
      res.status(200).json({ success: true, message: "Notification created successfully", notification: newNotification }); // ส่งกลับ notification ที่สร้างขึ้น
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ success: false, message: "Failed to create notification" });
    }
  });
  
  

  // เส้นทาง API สำหรับการอัปเดตสถานะการแจ้งเตือน
  data.put("/updateNotification/:id", async (req, res) => {
    try {
      const { status } = req.body;
      const notification = await Notifications.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
  
      if (notification) {
        res.status(200).json({ success: true, message: "Status updated successfully" });
      } else {
        res.status(404).json({ success: false, message: "Notification not found" });
      }
    } catch (error) {
      console.error("Error updating notification:", error);
      res.status(500).json({ success: false, message: "Error updating notification" });
    }
  });
  

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
  
  //api get notification ลงงานไปหาแอดมิน
  data.get("/getNotification", async (req, res) => {
    try {
      // ดึงการแจ้งเตือนทั้งหมด
      const notifications = await Notifications.find(); // สมมติว่า NotificationModel คือโมเดลการแจ้งเตือน
      res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลการแจ้งเตือนได้" });
    }
  });
  
//api อัปเดตสถานะการแจ้งเตือนการลงงาน
data.put("/updateNoti/:id", async (req, res) => {
    try {
        // ดึงข้อมูล status จาก req.body
        const { status } = req.body;

        // ตรวจสอบว่า status ถูกส่งมาหรือไม่
        if (!status) {
            return res.status(400).json({ success: false, message: "Status is required" });
        }

        // อัปเดตข้อมูลสถานะในฐานข้อมูล
        const notification = await Notifications.findByIdAndUpdate(
            req.params.id, // ใช้ id ที่ได้รับจาก URL params
            { status },     // อัปเดตสถานะเป็นค่าที่ส่งมาจาก body
            { new: true }   // รับข้อมูลอัปเดตใหม่
        );

        // ตรวจสอบว่าได้รับการอัปเดตสำเร็จหรือไม่
        if (notification) {
            res.status(200).json({ success: true, message: "Status updated successfully", notification });
        } else {
            res.status(404).json({ success: false, message: "Notification not found" });
        }
    } catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({ success: false, message: "Error updating notification" });
    }
});

  //api ลบการแจ้งเตือน 
  data.delete('/deleteNotification/:id', async (req, res) => {
    const notificationId = req.params.id;
  
    try {
      // ลบการแจ้งเตือนจากฐานข้อมูล
      const deletedNotification = await Notifications.findByIdAndDelete(notificationId);
  
      if (!deletedNotification) {
        return res.status(404).json({ success: false, message: 'Notification not found' });
      }
  
      res.status(200).json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

  
export default data;
