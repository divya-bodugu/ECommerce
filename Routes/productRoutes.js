import express from 'express';

import {
    createProduct,
    updateProductById,
    getAllProducts,
    getProductById,
    deleteProductById,
    importProductsCSV
} from "../Controllers/adminController.js";

import {
    viewAllPublishedProducts,
    viewPublishedProduct
} from "../Controllers/userControllers.js";

import { tokenVerify } from '../middleware/tokenVerify.js';

const router = express.Router();

router.post('/', tokenVerify, createProduct);
router.get('/', tokenVerify, getAllProducts);
router.get('/viewallproduct', tokenVerify, viewAllPublishedProducts);
router.get('/viewsingleproduct/:id', tokenVerify, viewPublishedProduct);
router.get('/:id', tokenVerify, getProductById);
router.put('/:id', tokenVerify, updateProductById);
router.delete('/:id', tokenVerify, deleteProductById);
router.post('/import', tokenVerify, importProductsCSV);

export default router;