import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Employee from "../models/Employee";

const isValidThaiID = (id: string): boolean => /^\d{13}$/.test(id);

const publicEmployee = (employee: any) => ({
  _id: employee._id,
  userId: employee.userId,
  username: employee.username,
  name: employee.name,
  department: employee.department,
  phone: employee.phone,
  email: employee.email,
  role: employee.role,
  status: employee.status,
  hrs: employee.hrs,
  workday: employee.workday,
});

export const getEmployee = async (_req: Request, res: Response) => {
  try {
    const employees = await Employee.find({ role: "Employee" });
    return res.status(200).json(employees.map(publicEmployee));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
};

export const addEmployee = async (req: Request, res: Response) => {
  const { userId, username, password, name, department, phone, email } = req.body;

  if (!userId || !username || !password || !name || !department || !phone || !email) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  if (!isValidThaiID(userId)) {
    return res.status(400).json({ error: "เลขบัตรประชาชนต้องมี 13 หลัก" });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" });
  }

  try {
    const duplicate = await Employee.findOne({
      $or: [{ userId }, { username }],
    });

    if (duplicate) {
      return res.status(409).json({
        error: "เลขบัตรประชาชนหรือชื่อผู้ใช้นี้ถูกใช้งานแล้ว",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      userId,
      username: String(username).trim(),
      password: hashedPassword,
      name: String(name).trim(),
      department: String(department).trim(),
      phone,
      email: String(email).trim(),
      role: "Employee",
      status: "Active",
    });

    return res.status(201).json(publicEmployee(employee));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "ไม่สามารถเพิ่มพนักงานได้" });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, name, department, phone, email } = req.body;

  if (!userId || !name || !department || !phone || !email) {
    return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  if (!isValidThaiID(userId)) {
    return res.status(400).json({ error: "เลขบัตรประชาชนต้องมี 13 หลัก" });
  }

  try {
    const duplicateUserId = await Employee.findOne({
      userId,
      _id: { $ne: id },
    });

    if (duplicateUserId) {
      return res.status(409).json({
        error: "เลขบัตรประชาชนนี้ถูกใช้งานแล้ว",
      });
    }

    const employee = await Employee.findOneAndUpdate(
      { _id: id, role: "Employee" },
      {
        userId,
        name: String(name).trim(),
        department: String(department).trim(),
        phone,
        email: String(email).trim(),
      },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ error: "ไม่พบพนักงานที่ต้องการแก้ไข" });
    }

    return res.status(200).json(publicEmployee(employee));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "ไม่สามารถแก้ไขข้อมูลพนักงานได้" });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const employee = await Employee.findOneAndDelete({
      _id: req.params.id,
      role: "Employee",
    });

    if (!employee) {
      return res.status(404).json({ error: "ไม่พบพนักงานที่ต้องการลบ" });
    }

    return res.status(200).json({ message: "ลบพนักงานเรียบร้อยแล้ว" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "ไม่สามารถลบพนักงานได้" });
  }
};

export const getEmployeeWorkDays = async (_req: Request, res: Response) => {
  try {
    const employees = await Employee.find({ role: "Employee" }).lean();

    const data = employees.map((employee: any) => {
      const hrs = Number(employee.hrs) || 0;
      const workday = Number(employee.workday) || 0;

      return {
        username: employee.username,
        name: employee.name,
        department: employee.department,
        hrs,
        workday,
        earnings: (workday * 420).toFixed(1),
      };
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "ไม่สามารถดึงข้อมูลการทำงานได้" });
  }
};