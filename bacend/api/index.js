import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import multer from "multer";
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

// OPTIONAL (logging)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
⚠️ IMPORTANT FOR VERCEL
Local file uploads do NOT work reliably.
You should use:
- Cloudinary
- S3
- Firebase Storage
*/

// TEMP upload config (works locally, NOT recommended for prod)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Images only"));
    }
  },
});

// Upload endpoint (returns file buffer info)
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // In real apps → upload req.file.buffer to Cloudinary/S3
  res.json({
    message: "File received",
    filename: req.file.originalname,
  });
});

// API routes
app.use("/api/products", productRoutes);
app.use("/api/users", useroutes);
app.use("/api/orders", orderroutes);

// Health check
app.get("/", (req, res) => {
  res.send("API is running on Vercel...");
});

export default app;
