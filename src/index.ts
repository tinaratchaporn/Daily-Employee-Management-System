import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes";

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});