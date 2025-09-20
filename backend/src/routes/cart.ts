import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, validateParams } from '../middleware/validation';
import {
  addToCartSchema,
  updateCartItemSchema,
  cartItemParamsSchema,
} from '../schemas/cart';

const router = Router();

// All cart routes require authentication
router.use(authenticateToken);

router.get('/', getCart);
router.post('/add', validateRequest(addToCartSchema), addToCart);
router.put('/:id', validateParams(cartItemParamsSchema), validateRequest(updateCartItemSchema), updateCartItem);
router.delete('/:id', validateParams(cartItemParamsSchema), removeFromCart);
router.delete('/', clearCart);

export default router;