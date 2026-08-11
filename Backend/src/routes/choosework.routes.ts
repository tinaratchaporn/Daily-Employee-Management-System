import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";

import {
  createChoosework,
  getChoosework,
  getChooseworkEmployee,
  updateChooseworkStatus,
} from "../controllers/choosework.controller";

const router = Router();

/* Route ใหม่ */
router.get("/", verifyToken, getChoosework);
router.post("/", verifyToken, createChoosework);
router.get("/employee", verifyToken, getChooseworkEmployee);
router.put("/:id", verifyToken, updateChooseworkStatus);

/* Route เก่า รองรับโค้ดเดิม */
router.post("/createChoosework", verifyToken, createChoosework);
router.get("/getChoosework", verifyToken, getChoosework);
router.get("/getChooseworkEmployee", verifyToken, getChooseworkEmployee);

export default router;