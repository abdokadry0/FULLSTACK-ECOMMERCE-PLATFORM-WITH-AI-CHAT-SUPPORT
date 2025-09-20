import { Router } from 'express';
import { createOrder, getUserOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus } from '../controllers/orderController';
import { authenticateToken } from '../middleware/auth';
import { adminOnly } from '../middleware/security';
import { validateRequest, validateParams } from '../middleware/validation';
import { createOrderSchema, orderParamsSchema, updateOrderStatusSchema } from '../schemas/order';

const router = Router();

// User order routes
router.post('/', authenticateToken, validateRequest(createOrderSchema), createOrder);
router.get('/my-orders', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, validateParams(orderParamsSchema), getOrderById);
router.patch('/:id/cancel', authenticateToken, validateParams(orderParamsSchema), cancelOrder);

// Admin order routes
router.get('/', authenticateToken, adminOnly, getAllOrders);
router.patch('/:id/status', authenticateToken, adminOnly, validateParams(orderParamsSchema), validateRequest(updateOrderStatusSchema), updateOrderStatus);

export default router;