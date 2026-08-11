import { Request, Response } from "express";
import Choosework from "../models/Choosework";

// ลงงาน
export const createChoosework = async (req: Request, res: Response) => {
  const { userId, username, department, task, date } = req.body;

  if (!userId || !username || !department || !task || !date) {
    return res.status(400).json({
      error: "กรุณากรอกข้อมูลให้ครบถ้วน",
    });
  }

  try {
    const work = await Choosework.create({
      userId,
      username,
      department: String(department).trim(),
      task: String(task).trim(),
      date,
      status: "Pending",
    });

    return res.status(201).json(work);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "ไม่สามารถบันทึกรายการลงงานได้",
    });
  }
};

// ดึงข้อมูลลงงานทั้งหมด (Admin)
export const getChoosework = async (_req: Request, res: Response) => {
  try {
    const works = await Choosework.find().sort({ date: -1 });
    return res.status(200).json(works);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "ไม่สามารถดึงข้อมูลรายการลงงานได้",
    });
  }
};

// ดึงข้อมูลลงงานของพนักงานคนเดียว
export const getChooseworkEmployee = async (
  req: Request,
  res: Response
) => {
  const username = req.query.username as string;

  if (!username) {
    return res.status(400).json({
      error: "กรุณาระบุ username",
    });
  }

  try {
    const works = await Choosework.find({ username }).sort({ date: -1 });
    return res.status(200).json(works);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "ไม่สามารถดึงรายการลงงานได้",
    });
  }
};

// อนุมัติ / ปฏิเสธรายการลงงาน
export const updateChooseworkStatus = async (
  req: Request,
  res: Response
) => {
  const { status } = req.body;

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({
      error: "สถานะไม่ถูกต้อง",
    });
  }

  try {
    const work = await Choosework.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!work) {
      return res.status(404).json({
        error: "ไม่พบรายการลงงาน",
      });
    }

    return res.status(200).json(work);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "ไม่สามารถอัปเดตสถานะได้",
    });
  }
};