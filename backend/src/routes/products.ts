import { Router } from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticateToken } from '../middleware/auth';
import { adminOnly } from '../middleware/security';
import { validateRequest, validateParams } from '../middleware/validation';
import { createProductSchema, updateProductSchema, productParamsSchema } from '../schemas/product';

const router = Router();

// Public product routes
router.get('/', getProducts);
router.get('/:id', validateParams(productParamsSchema), getProduct);

// Admin product routes
router.post('/', authenticateToken, adminOnly, validateRequest(createProductSchema), createProduct);
router.put('/:id', authenticateToken, adminOnly, validateParams(productParamsSchema), validateRequest(updateProductSchema), updateProduct);
router.delete('/:id', authenticateToken, adminOnly, validateParams(productParamsSchema), deleteProduct);

export default router;