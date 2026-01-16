import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import connectDb from "../config/db.js";
import orderroutes from "../routes/orderRoutes.js";
import productRoutes from "../routes/productRoutes.js";
import useroutes from "../routes/useroutes.js";

dotenv.config();
connectDb();

const app = express();

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// keep your existing upload logic as-is
const uploadDir = path.join(__dirname, "../images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// routes
app.use("/api/products", productRoutes);
app.use("/api/users", useroutes);
app.use("/api/orders", orderroutes);

// test route
app.get("/", (req, res) => {
  res.send("API running on Vercel");
});

// ⛔ NO app.listen()
export default app;
