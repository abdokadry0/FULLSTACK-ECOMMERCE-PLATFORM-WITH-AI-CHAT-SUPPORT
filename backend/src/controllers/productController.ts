import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest, ApiResponse, PaginatedResponse, ProductQuery, CreateProductData } from '../types';
import { AppError } from '../types';

// Helper function to generate slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      minPrice,
      maxPrice,
      featured,
      inStock,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    }: ProductQuery = req.query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (inStock !== undefined && inStock) {
      where.OR = [
        { trackInventory: false },
        { AND: [{ trackInventory: true }, { inventoryQuantity: { gt: 0 } }] },
        { AND: [{ trackInventory: true }, { allowBackorders: true }] },
      ];
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else if (sortBy === 'price') {
      orderBy.price = sortOrder;
    } else if (sortBy === 'featured') {
      orderBy.featured = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            select: {
              id: true,
              url: true,
              altText: true,
              position: true,
            },
            orderBy: {
                position: 'asc',
              },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    const response: ApiResponse<PaginatedResponse<typeof products[0]>> = {
      success: true,
      data: {
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get products error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'PRODUCTS_FETCH_FAILED',
        message: 'Failed to fetch products',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
        isActive: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            altText: true,
            position: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    if (!product) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: { product },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get product error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'PRODUCT_FETCH_FAILED',
        message: 'Failed to fetch product',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
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

    const productData: CreateProductData = req.body;

    // Generate slug from name
    const slug = generateSlug(productData.name);

    // Check if slug already exists
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.product.findFirst({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // Validate category if provided
    if (productData.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: productData.categoryId,
          isActive: true,
        },
      });

      if (!category) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'CATEGORY_NOT_FOUND',
            message: 'Category not found',
          },
          timestamp: new Date().toISOString(),
        };
        return res.status(400).json(response);
      }
    }

    const product = await prisma.product.create({
      data: {
        ...productData,
        slug: finalSlug,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    const response: ApiResponse = {
      success: true,
      data: { product },
      timestamp: new Date().toISOString(),
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error('Create product error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'PRODUCT_CREATE_FAILED',
        message: 'Failed to create product',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
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
    const updateData = req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(404).json(response);
    }

    // Generate new slug if name is being updated
    if (updateData.name && updateData.name !== existingProduct.name) {
      const slug = generateSlug(updateData.name);
      let finalSlug = slug;
      let counter = 1;
      while (await prisma.product.findFirst({ 
        where: { 
          slug: finalSlug,
          id: { not: parseInt(id) }
        } 
      })) {
        finalSlug = `${slug}-${counter}`;
        counter++;
      }
      updateData.slug = finalSlug;
    }

    // Validate category if provided
    if (updateData.categoryId) {
      const category = await prisma.category.findFirst({
        where: {
          id: updateData.categoryId,
          isActive: true,
        },
      });

      if (!category) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'CATEGORY_NOT_FOUND',
            message: 'Category not found',
          },
          timestamp: new Date().toISOString(),
        };
        return res.status(400).json(response);
      }
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            altText: true,
            position: true,
          },
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    const response: ApiResponse = {
      success: true,
      data: { product },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Update product error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'PRODUCT_UPDATE_FAILED',
        message: 'Failed to update product',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
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

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'PRODUCT_NOT_FOUND',
          message: 'Product not found',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(404).json(response);
    }

    // Soft delete by setting isActive to false
    await prisma.product.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });

    const response: ApiResponse = {
      success: true,
      data: { message: 'Product deleted successfully' },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Delete product error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'PRODUCT_DELETE_FAILED',
        message: 'Failed to delete product',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};