import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes"; // อย่าลืมใส่ default import ให้ตรง

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// ใช้ Router ที่ import มาจาก routes.ts
app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
