import { Router } from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentMethods,
  savePaymentMethod,
  deletePaymentMethod,
  handleStripeWebhook,
} from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, validateParams } from '../middleware/validation';
import {
  createPaymentIntentSchema,
  confirmPaymentSchema,
  savePaymentMethodSchema,
  paymentMethodParamsSchema,
} from '../schemas/payment';

const router = Router();

// Payment routes (all require authentication)
router.post('/create-intent', authenticateToken, validateRequest(createPaymentIntentSchema), createPaymentIntent);
router.post('/confirm', authenticateToken, validateRequest(confirmPaymentSchema), confirmPayment);

// Payment methods routes
router.get('/methods', authenticateToken, getPaymentMethods);
router.post('/methods', authenticateToken, validateRequest(savePaymentMethodSchema), savePaymentMethod);
router.delete('/methods/:paymentMethodId', authenticateToken, validateParams(paymentMethodParamsSchema), deletePaymentMethod);

// Webhook route (no authentication required)
router.post('/webhook', handleStripeWebhook);

export default router;