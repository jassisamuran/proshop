import express from "express";
import path from "path";
import morgan from "morgan";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import multer from "multer";
import cors from "cors";
import fs from "fs";

import connectDb from "./config/db.js";
import products from "./data/product.js";
import productRoutes from "./routes/productRoutes.js";
import useroutes from "./routes/useroutes.js";
import orderroutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();
connectDb();
const app = express();

app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "images/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Upload endpoint
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    console.log("No file uploaded.");
    return res.status(400).send("No file uploaded.");
  }
  console.log(`File uploaded to: /${req.file.path}`);
  res.send(`/${req.file.path}`);
});

app.use("/api/products", productRoutes);
app.use("/api/users", useroutes);
app.use("/api/orders", orderroutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/proshop/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "proshop", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

const Port = process.env.PORT || 5000;
app.listen(Port, () => console.log(`Server running on port ${Port}`));
