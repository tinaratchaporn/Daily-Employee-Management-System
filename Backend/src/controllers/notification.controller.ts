import { Request, Response } from "express";
import Notifications from "../models/Notifications";
import { sendNotification } from "../socket";

// =======================
// สร้าง Notification
// =======================
export const createNotification = async (
  req: Request,
  res: Response
) => {
  try {
    const { username, date, type, status, reason } = req.body;

    if (!username || !date || !type || !reason) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
    }

    const newNotification = await Notifications.create({
      username,
      date,
      type,
      status: status || "Pending",
      reason,
    });

    // ===== Realtime =====
    sendNotification({
      action: "CREATE",
      notification: newNotification,
    });

    return res.status(201).json({
      success: true,
      message: "สร้างการแจ้งเตือนสำเร็จ",
      notification: newNotification,
    });
  } catch (error) {
    console.error("Create Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create notification",
    });
  }
};

// =======================
// ดึง Notification ทั้งหมด
// =======================
export const getNotification = async (
  _req: Request,
  res: Response
) => {
  try {
    const notifications = await Notifications.find().sort({
      createdAt: -1,
    });

    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Get Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: "ไม่สามารถดึงข้อมูลการแจ้งเตือนได้",
    });
  }
};

// =======================
// อัปเดต Notification
// =======================
export const updateNotification = async (
  req: Request,
  res: Response
) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const notification = await Notifications.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // ===== Realtime =====
    sendNotification({
      action: "UPDATE",
      notification,
    });

    return res.status(200).json({
      success: true,
      message: "อัปเดตสถานะสำเร็จ",
      notification,
    });
  } catch (error) {
    console.error("Update Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error updating notification",
    });
  }
};

// =======================
// ลบ Notification
// =======================
export const deleteNotification = async (
  req: Request,
  res: Response
) => {
  try {
    const deletedNotification =
      await Notifications.findByIdAndDelete(req.params.id);

    if (!deletedNotification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // ===== Realtime =====
    sendNotification({
      action: "DELETE",
      id: req.params.id,
    });

    return res.status(200).json({
      success: true,
      message: "ลบ Notification สำเร็จ",
    });
  } catch (error) {
    console.error("Delete Notification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};