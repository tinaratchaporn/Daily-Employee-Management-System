import express from "express";
import { verifyToken } from "../middleware/auth.middleware";
import {
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeWorkDays,
} from "../controllers/employee.controller";

const router = express.Router();

router.get("/", verifyToken, getEmployee);
router.post("/", verifyToken, addEmployee);
router.put("/:id", verifyToken, updateEmployee);
router.delete("/:id", verifyToken, deleteEmployee);
router.get("/workdays", verifyToken, getEmployeeWorkDays);

/* รองรับ URL เก่า */
router.get("/getEmployee", verifyToken, getEmployee);
router.post("/addEmployee", verifyToken, addEmployee);
router.put("/updateEmployee/:id", verifyToken, updateEmployee);
router.delete("/deleteEmployee/:id", verifyToken, deleteEmployee);
router.get("/getempinfoForworkDays", verifyToken, getEmployeeWorkDays);

export default router;