import { Request, Response } from "express";
import Leave from "../models/Leave";

// ส่งคำขอลา
export const createLeaveRequest = async (req: Request, res: Response) => {
  const { username, reason, date, type, status } = req.body;

  try {
    if (!username || !reason || !date || !type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newLeaveRequest = new Leave({
      username,
      reason,
      date,
      type,
      status: status || "Pending",
    });

    await newLeaveRequest.save();

    res.json({
      success: true,
      message: "Leave request created successfully",
    });
  } catch (err) {
    console.error("Error creating leave request:", err);
    res.status(500).json({
      success: false,
      message: "Error creating leave request",
    });
  }
};

// ดึงคำขอลาที่รออนุมัติ
export const getLeaveRequests = async (_req: Request, res: Response) => {
  try {
    const leaveRequests = await Leave.find({ status: "Pending" });

    res.status(200).json(leaveRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "ไม่สามารถดึงข้อมูลคำขอลางานได้",
    });
  }
};

// // อนุมัติ / ปฏิเสธการลา
// export const approveLeave = async (req: Request, res: Response) => {
//   const { username, status } = req.body;

//   if (!username || !status) {
//     return res.status(400).json({
//       message: "Missing username or status",
//     });
//   }

//   try {
//     const result = await Leave.updateOne(
//       { username, status: "Pending" },
//       { $set: { status } }
//     );

//     if (result.modifiedCount > 0) {
//       res.json({
//         message: "Leave request approved",
//       });
//     } else {
//       res.json({
//         message: "No pending leave request found for this username",
//       });
//     }
//   } catch (err) {
//     console.error("Error approving leave:", err);
//     res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };

// อัปเดตสถานะคำขอลา
export const updateLeaveRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุสถานะ",
      });
    }

    const updatedRequest = await Leave.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบคำขอลา",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedRequest,
    });
  } catch (error) {
    console.error("Error updating leave request:", error);

    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์",
    });
  }
};