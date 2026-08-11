import express from "express";
import { verifyToken } from "../middleware/auth.middleware";

import {
  createLeaveRequest,
  getLeaveRequests,
  updateLeaveRequest,
} from "../controllers/leave.controller";

const router = express.Router();

router.post("/createLeaveRequest", verifyToken, createLeaveRequest);
router.get("/getLeaveRequests", verifyToken, getLeaveRequests);
router.put("/updateLeaveRequest/:id", verifyToken, updateLeaveRequest);

export default router;