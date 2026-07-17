import { Router, Request, Response } from "express";
import { ApiResponse } from "./model";

const router = Router();

interface LoginRequestBody {
  username: string;
  password: string;
}

router.post("/check-user", (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      const response: ApiResponse = {
        code: "Error-01-0001",
        status: "Failed",
        message: { error: "Missing username" }
      };
      return res.status(400).json(response);
    }

    if (username !== "admin" || password !== "1234") {
      const response: ApiResponse = {
        code: "Error-01-0002",
        status: "Failed",
        message: { error: "Invalid credentials" }
      };
      return res.status(401).json(response);
    }

    const response: ApiResponse = {
      code: "Success-01-0001",
      status: "Success",
      message: { username: "admin" }
    };
    return res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      code: "Error-01-9999",
      status: "Failed",
      message: { error: "Internal Server Error" }
    };
    return res.status(500).json(response);
  }
});

export default router;