import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";

import {
  createNotification,
  getNotification,
  updateNotification,
  deleteNotification,
} from "../controllers/notification.controller";

const router = Router();

router.post("/createNotification", verifyToken, createNotification);
router.get("/getNotification", verifyToken, getNotification);
router.put("/updateNotification/:id", verifyToken, updateNotification);
router.delete("/deleteNotification/:id", verifyToken, deleteNotification);

export default router;