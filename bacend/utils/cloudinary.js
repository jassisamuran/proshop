import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME || "dvqxj0tqr",
  api_key: process.env.CLOUDINARY_API_KEY || "152478233213239",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "Yox-3FaN0UEkQ0ezQqtq8W9-CmE",
});

export default cloudinary;
