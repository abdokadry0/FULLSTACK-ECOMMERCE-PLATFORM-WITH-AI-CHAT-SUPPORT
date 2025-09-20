import Joi from 'joi';

export const createOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
  paymentMethod: Joi.string().valid('stripe', 'paypal').required(),
  notes: Joi.string().optional(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
    .required(),
});

export const orderQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
  sortBy: Joi.string().valid('createdAt', 'total', 'status').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

export const orderParamsSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const adminOrderQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
  userId: Joi.string().uuid(),
  sortBy: Joi.string().valid('createdAt', 'total', 'status', 'userId').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});