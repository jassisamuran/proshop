import express from "express";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getProducts,
  getProductsById,
  getProductsByIds,
  getTopProduct,
  updateProduct,
} from "../controllers/productControllers.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/getProductByIds").post(getProductsByIds);
router.route("/").get(getProducts).post(protect, admin, createProduct);
router
  .route("/:id")
  .get(getProductsById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);
router.route("/:id/reviews").post(protect, createProductReview);
// router.get('/top', getTopProducts)
router.route("/:id/top").get(getTopProduct);
export default router;
