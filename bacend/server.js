import express from "express";
import path from "path";
const app = express();
import morgan from "morgan";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import cors from "cors";
// import useParams from 'react-router-dom'
dotenv.config();
connectDb();
import connectDb from "./config/db.js";
import products from "./data/product.js";
import productRoutes from "./routes/productRoutes.js";
import useroutes from "./routes/useroutes.js";
import orderroutes from "./routes/orderRoutes.js";

import uploadRoutes from "./routes/uploadRoutes.js";
app.use(express.json());
app.use(cors());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "images")));

// if(process.env.NODE_ENV==='development'){
// app.use(morgan('node'))
// }
// app.get('/',(re,res)=>{
//     res.send('APi is running ...')
// })

app.use("/api/products", productRoutes);
app.use("/api/users", useroutes);
app.use("/api/orders", orderroutes);
app.use("/api/upload", uploadRoutes);

// __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
// app.use('/uploads', express.static('public'));

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/proshop/build")));
  app.get("*");
} else {
  app.get("/", (re, res) => {
    res.send("Api is running...");
  });
}

const Port = process.env.PORT || 5000;
app.listen(Port, console.log("running on port 5000"));
