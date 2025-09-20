import Joi from 'joi';

export const createPaymentIntentSchema = Joi.object({
  orderId: Joi.string().uuid().required(),
});

export const confirmPaymentSchema = Joi.object({
  paymentIntentId: Joi.string().required(),
});

export const savePaymentMethodSchema = Joi.object({
  paymentMethodId: Joi.string().required(),
});

export const paymentMethodParamsSchema = Joi.object({
  paymentMethodId: Joi.string().required(),
});