import express from "express";
import http from "http";
import { Server } from "socket.io";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import bcrypt from "bcrypt";

import connectDatabase from "./config/database";
import Employee from "./models/Employee";

import authRouter from "./routes/auth.routes";
import employeeRouter from "./routes/employee.routes";
import leaveRouter from "./routes/leave.routes";
import chooseworkRouter from "./routes/choosework.routes";
import notificationRouter from "./routes/notification.routes";

dotenv.config();

connectDatabase();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use("/api/auth", authRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/leaves", leaveRouter);
app.use("/api/chooseworks", chooseworkRouter);
app.use("/api/notifications", notificationRouter);

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});



const PORT = process.env.PORT || 9000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

export default app;