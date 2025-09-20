import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const createPaymentIntent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId = parseInt(req.user!.userId);

    // Get order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Order is not pending payment',
      });
    }

    // Create or retrieve payment intent
    let paymentIntent;
    if (order.stripePaymentIntentId) {
      paymentIntent = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
    } else {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(order.totalAmount) * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          orderId: order.id.toString(),
          userId: userId.toString(),
        },
      });

      // Update order with payment intent ID
      await prisma.order.update({
        where: { id: order.id },
        data: {
          stripePaymentIntentId: paymentIntent.id,
        },
      });
    }

    return res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const confirmPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { paymentIntentId } = req.body;
    const userId = parseInt(req.user!.userId);

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.metadata.userId !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Update order status based on payment status
    const orderId = parseInt(paymentIntent.metadata.orderId);
    let orderStatus = 'pending';

    if (paymentIntent.status === 'succeeded') {
      orderStatus = 'processing';
    } else if (paymentIntent.status === 'canceled') {
      orderStatus = 'cancelled';
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: orderStatus,
        paymentStatus: paymentIntent.status === 'succeeded' ? 'paid' : 'failed',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      data: {
        order,
        paymentStatus: paymentIntent.status,
      },
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getPaymentMethods = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = parseInt(req.user!.userId);

    // Get user's saved payment methods from Stripe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.stripeCustomerId) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    });

    return res.json({
      success: true,
      data: paymentMethods.data,
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const savePaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { paymentMethodId } = req.body;
    const userId = parseInt(req.user!.userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    let customerId = user?.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user!.email,
        metadata: {
          userId: userId,
        },
      });

      customerId = customer.id;

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: customerId,
        },
      });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    res.json({
      success: true,
      data: paymentMethod,
    });
  } catch (error) {
    console.error('Save payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deletePaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { paymentMethodId } = req.params;

    await stripe.paymentMethods.detach(paymentMethodId);

    res.json({
      success: true,
      message: 'Payment method deleted successfully',
    });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Stripe webhook handler
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = parseInt(paymentIntent.metadata.orderId);

        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: 'processing',
              paymentStatus: 'paid',
            },
          });
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        const failedOrderId = parseInt(failedPayment.metadata.orderId);

        if (failedOrderId) {
          await prisma.order.update({
            where: { id: failedOrderId },
            data: {
              status: 'cancelled',
            },
          });

          // Restore product stock
          const order = await prisma.order.findUnique({
            where: { id: failedOrderId },
            include: { 
              items: true 
            },
          });

          if (order) {
            for (const item of order.items) {
              await prisma.product.update({
                where: { id: item.productId },
                data: {
                  inventoryQuantity: {
                    increment: item.quantity,
                  },
                },
              });
            }
          }
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return res.status(500).json({
      success: false,
      message: 'Webhook handler error',
    });
  }
};