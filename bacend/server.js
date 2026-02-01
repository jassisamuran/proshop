import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import connectDb from "./config/db.js";
import orderroutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import useroutes from "./routes/useroutes.js";
import cloudinary from "./utils/cloudinary.js";
connectDb();
const app = express();
app.use(express.json());
// app.use(cors());
app.use(
  cors({
    origin: "https://ecommercefrontend-theta-lovat.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// storage for local
// app.use("/images", express.static(path.join(__dirname, "images")));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Ensure uploads directory exists
// const uploadDir = path.join(__dirname, "images");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, uploadDir); // Use absolute path
//   },
//   filename(req, file, cb) {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     );
//   },
// });

// const checkFileType = (file, cb) => {
//   const filetypes = /jpg|jpeg|png/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb("Images only!");
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   },
// });

// // Upload endpoint
// app.post("/api/upload", upload.single("image"), (req, res) => {
//   if (!req.file) {
//     console.log("No file uploaded.");
//     return res.status(400).send("No file uploaded.");
//   }
//   console.log(`File uploaded to: /images/${req.file.filename}`);
//   res.send(`images/${req.file.filename}`);
// });

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
// });

// app.post("/api/upload", async (req, res) => {
//   try {
//     const { fileName, fileType } = req.body;

//     if (!fileName || !fileType) {
//       return res.status(400).json({ message: "Invalid file data" });
//     }

//     const key = `products/${Date.now()}-${fileName}`;

//     const command = new PutObjectCommand({
//       Bucket: process.env.S3_BUCKET,
//       Key: key,
//       ContentType: fileType,
//     });

//     const uploadUrl = await getSignedUrl(s3, command, {
//       expiresIn: 60,
//     });

//     res.json({
//       uploadUrl,
//       imageUrl: `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${key}`,
//       imageKey: key,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Upload failed" });
//   }
// });

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("image"), (req, res) => {
  console.log("Upload route hit", req.file); // <-- add this

  res.json({
    imageUrl: req.file.path,
    imageId: req.file.filename,
  });
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
