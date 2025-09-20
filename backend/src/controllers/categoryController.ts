import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest, ApiResponse } from '../types';

// Helper function to generate slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            products: {
              where: { isActive: true },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const response: ApiResponse = {
      success: true,
      data: { categories },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get categories error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch categories',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        id: parseInt(id),
        isActive: true,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            products: {
              where: { isActive: true },
            },
          },
        },
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
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: { category },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get category error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch category',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const createCategory = async (req: AuthenticatedRequest, res: Response) => {
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

    const { name, description, imageUrl, parentId, isActive = true } = req.body;

    // Generate slug from name
    const slug = generateSlug(name);

    // Check if slug already exists
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.category.findFirst({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // Validate parent category if provided
    if (parentId) {
      const parentCategory = await prisma.category.findFirst({
        where: {
          id: parentId,
          isActive: true,
        },
      });

      if (!parentCategory) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'PARENT_CATEGORY_NOT_FOUND',
            message: 'Parent category not found',
          },
          timestamp: new Date().toISOString(),
        };
        return res.status(400).json(response);
      }
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug: finalSlug,
        description,
        imageUrl,
        parentId,
        isActive,
      },
      include: {
        parent: {
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
      data: { category },
      timestamp: new Date().toISOString(),
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error('Create category error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create category',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const updateCategory = async (req: AuthenticatedRequest, res: Response) => {
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

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCategory) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'CATEGORY_NOT_FOUND',
          message: 'Category not found',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(404).json(response);
    }

    // Generate new slug if name is being updated
    if (updateData.name && updateData.name !== existingCategory.name) {
      const slug = generateSlug(updateData.name);
      let finalSlug = slug;
      let counter = 1;
      while (await prisma.category.findFirst({ 
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

    // Validate parent category if provided
    if (updateData.parentId) {
      // Check if trying to set itself as parent
      if (updateData.parentId === parseInt(id)) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'INVALID_PARENT',
            message: 'Category cannot be its own parent',
          },
          timestamp: new Date().toISOString(),
        };
        return res.status(400).json(response);
      }

      const parentCategory = await prisma.category.findFirst({
        where: {
          id: updateData.parentId,
          isActive: true,
        },
      });

      if (!parentCategory) {
        const response: ApiResponse = {
          success: false,
          error: {
            code: 'PARENT_CATEGORY_NOT_FOUND',
            message: 'Parent category not found',
          },
          timestamp: new Date().toISOString(),
        };
        return res.status(400).json(response);
      }
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            imageUrl: true,
          },
        },
      },
    });

    const response: ApiResponse = {
      success: true,
      data: { category },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Update category error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update category',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const deleteCategory = async (req: AuthenticatedRequest, res: Response) => {
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

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!existingCategory) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'CATEGORY_NOT_FOUND',
          message: 'Category not found',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(404).json(response);
    }

    // Check if category has products or subcategories
    if (existingCategory._count.products > 0 || existingCategory._count.children > 0) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'CATEGORY_HAS_DEPENDENCIES',
          message: 'Cannot delete category that has products or subcategories',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(400).json(response);
    }

    // Soft delete by setting isActive to false
    await prisma.category.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });

    const response: ApiResponse = {
      success: true,
      data: { message: 'Category deleted successfully' },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Delete category error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete category',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};