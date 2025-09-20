import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest, ApiResponse, AddToCartData } from '../types';

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(401).json(response);
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: parseInt(req.user.userId) },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            comparePrice: true,
            inventoryQuantity: true,
            trackInventory: true,
            allowBackorders: true,
            isActive: true,
            images: {
              select: {
                id: true,
                url: true,
                altText: true,
              },
              take: 1,
              orderBy: {
                position: 'asc',
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate cart totals
    let subtotal = 0;
    let totalItems = 0;
    const validItems = cartItems.filter((item: typeof cartItems[0]) => {
      if (!item.product.isActive) return false;
      
      // Check inventory
      if (item.product.trackInventory && !item.product.allowBackorders) {
        if (item.product.inventoryQuantity < item.quantity) {
          return false;
        }
      }
      
      subtotal += Number(item.product.price) * item.quantity;
      totalItems += item.quantity;
      return true;
    });

    const response: ApiResponse = {
      success: true,
      data: {
        items: validItems,
        summary: {
          subtotal,
          totalItems,
          itemCount: validItems.length,
        },
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get cart error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to retrieve cart',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const addToCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(401).json(response);
    }

    const { productId, quantity }: AddToCartData = req.body;

    // Check if product exists and is active
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true,
      },
    });

    if (!product) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found or inactive',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(404).json(response);
    }

    // Check inventory
    if (product.trackInventory && !product.allowBackorders) {
      if (product.inventoryQuantity < quantity) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'INSUFFICIENT_INVENTORY',
            message: `Only ${product.inventoryQuantity} items available in stock`,
          },
          timestamp: new Date().toISOString(),
        };
        return res.status(400).json(response);
      }
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: parseInt(req.user.userId),
        productId,
      },
    });

    let cartItem;

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      
      // Check inventory for updated quantity
      if (product.trackInventory && !product.allowBackorders) {
        if (product.inventoryQuantity < newQuantity) {
          const response: ApiResponse = {
            success: false,
            error: {
              code: 'INSUFFICIENT_INVENTORY',
              message: `Only ${product.inventoryQuantity} items available in stock`,
            },
            timestamp: new Date().toISOString(),
          };
          return res.status(400).json(response);
        }
      }

      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              comparePrice: true,
              images: {
                select: {
                  id: true,
                  url: true,
                  altText: true,
                },
                take: 1,
                orderBy: {
                  position: 'asc',
                },
              },
            },
          },
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId: parseInt(req.user.userId),
          productId,
          quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              comparePrice: true,
              images: {
                select: {
                  id: true,
                  url: true,
                  altText: true,
                },
                take: 1,
                orderBy: {
                  position: 'asc',
                },
              },
            },
          },
        },
      });
    }

    const response: ApiResponse = {
      success: true,
      data: { cartItem },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Add to cart error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to add item to cart',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const updateCartItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(401).json(response);
    }

    const { id } = req.params;
    const { quantity } = req.body;

    // Check if cart item exists and belongs to user
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        id: parseInt(id),
        userId: parseInt(req.user.userId),
      },
      include: {
        product: true,
      },
    });

    if (!existingCartItem) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'CART_ITEM_NOT_FOUND',
          message: 'Cart item not found',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(404).json(response);
    }

    // Check if product is still active
    if (!existingCartItem.product.isActive) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'PRODUCT_INACTIVE',
          message: 'Product is no longer available',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(400).json(response);
    }

    // Check inventory
    if (existingCartItem.product.trackInventory && !existingCartItem.product.allowBackorders) {
      if (existingCartItem.product.inventoryQuantity < quantity) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'INSUFFICIENT_INVENTORY',
            message: `Only ${existingCartItem.product.inventoryQuantity} items available in stock`,
          },
          timestamp: new Date().toISOString(),
        };
        return res.status(400).json(response);
      }
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: parseInt(id) },
      data: { quantity },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            comparePrice: true,
            images: {
              select: {
                id: true,
                url: true,
                altText: true,
              },
              take: 1,
              orderBy: {
                position: 'asc',
              },
            },
          },
        },
      },
    });

    const response: ApiResponse = {
      success: true,
      data: { cartItem },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Update cart error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update cart item',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const removeFromCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(401).json(response);
    }

    const { id } = req.params;

    // Check if cart item exists and belongs to user
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        id: parseInt(id),
        userId: parseInt(req.user.userId),
      },
    });

    if (!existingCartItem) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'CART_ITEM_NOT_FOUND',
          message: 'Cart item not found',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(404).json(response);
    }

    await prisma.cartItem.delete({
      where: { id: parseInt(id) },
    });

    const response: ApiResponse = {
      success: true,
      data: { message: 'Item removed from cart successfully' },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Remove from cart error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to remove item from cart',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const clearCart = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(401).json(response);
    }

    await prisma.cartItem.deleteMany({
      where: { userId: parseInt(req.user.userId) },
    });

    const response: ApiResponse = {
      success: true,
      data: { message: 'Cart cleared successfully' },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Clear cart error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to clear cart',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};