import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes";

const app = express();
// สร้าง port
const PORT = 3000;

app.use(bodyParser.json());
app.use("/", userRoutes);

// สร้าง server และเชื่อมต่อ
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});