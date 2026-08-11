import { Request, Response } from "express";
import Employee from "../models/Employee";
import bcrypt from "bcrypt";

// ฟังก์ชันตรวจสอบความถูกต้องของหมายเลขบัตรประชาชนไทย
const isValidThaiID = (id: string): boolean => {
    const regex = /^\d{13}$/;
    return regex.test(id);
};

// ดึงข้อมูลพนักงานทั้งหมด
export const getEmployee = async (_req: Request, res: Response) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        console.error("Error retrieving employees:", err);
        res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
    }
};

// เพิ่มพนักงานใหม่
export const addEmployee = async (req: Request, res: Response) => {
  const {
    userId,
    username,
    password,
    name,
    department,
    phone,
    email,
    role,
  } = req.body;

  if (
    !userId ||
    !username ||
    !password ||
    !name ||
    !department ||
    !phone ||
    !email
  ) {
    return res.status(400).json({
      error: "กรุณากรอกข้อมูลให้ครบถ้วน",
    });
  }

  if (!isValidThaiID(userId)) {
    return res.status(400).json({
      error: "หมายเลขบัตรประชาชนไม่ถูกต้อง",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await Employee.create({
      userId,
      username,
      password: hashedPassword,
      name,
      department,
      phone,
      email,
      role: role || "employee",
    });

    const employees = await Employee.find();

    res.status(201).json(employees);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์",
    });
  }
};

// อัปเดตข้อมูลพนักงานตาม ID
export const updateEmployee = async (req: Request, res: Response) => {
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
};

// ลบพนักงานตาม ID
export const deleteEmployee = async (req: Request, res: Response) => {
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
};

export const getEmployeeWorkDays = async (
  req: Request,
  res: Response
) => {
  try {
    const employees = await Employee.find().lean();

    const filteredEmployees = employees.filter(
      (employee: any) => employee.role !== "admin"
    );

    const employeeData = filteredEmployees.map((employee: any) => {
      const totalHours =
        typeof employee.hrs === "string"
          ? parseFloat(employee.hrs)
          : employee.hrs;

      const totalDays =
        typeof employee.workday === "string"
          ? parseInt(employee.workday)
          : employee.workday;

      return {
        username: employee.username,
        name: employee.name,
        department: employee.department,
        hrs: totalHours,
        workday: totalDays,
        earnings: (totalDays * 420).toFixed(1),
      };
    });

    res.json({
      success: true,
      data: employeeData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูล",
    });
  }
};