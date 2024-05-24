import express from "express";

const router=express.Router()
import { createProduct, createProductReview, deleteProduct, getProducts, getProductsById, getTopProduct, updateProduct } from '../controllers/productControllers.js'
import { admin, protect } from "../middleware/authMiddleware.js";

router.route('/').get(getProducts)
.post(protect,admin,createProduct)
router.route('/:id').get(getProductsById).delete(protect,admin,deleteProduct)
.put(protect,admin,updateProduct)
router.route('/:id/reviews').post(protect,createProductReview)
// router.get('/top', getTopProducts)
router.route('/:id/top').get(getTopProduct)
export default router