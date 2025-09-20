import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.min': 'Product name must be at least 2 characters long',
      'string.max': 'Product name cannot exceed 255 characters',
      'any.required': 'Product name is required',
    }),
  description: Joi.string()
    .max(5000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 5000 characters',
    }),
  shortDescription: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Short description cannot exceed 500 characters',
    }),
  sku: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'SKU cannot exceed 100 characters',
    }),
  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Price must be a positive number',
      'any.required': 'Price is required',
    }),
  comparePrice: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      'number.positive': 'Compare price must be a positive number',
    }),
  costPrice: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      'number.positive': 'Cost price must be a positive number',
    }),
  inventoryQuantity: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .messages({
      'number.integer': 'Inventory quantity must be an integer',
      'number.min': 'Inventory quantity cannot be negative',
    }),
  trackInventory: Joi.boolean()
    .default(true),
  allowBackorders: Joi.boolean()
    .default(false),
  weight: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      'number.positive': 'Weight must be a positive number',
    }),
  categoryId: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.integer': 'Category ID must be an integer',
      'number.positive': 'Category ID must be a positive number',
    }),
  isActive: Joi.boolean()
    .default(true),
  featured: Joi.boolean()
    .default(false),
});

export const updateProductSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .optional()
    .messages({
      'string.min': 'Product name must be at least 2 characters long',
      'string.max': 'Product name cannot exceed 255 characters',
    }),
  description: Joi.string()
    .max(5000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 5000 characters',
    }),
  shortDescription: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Short description cannot exceed 500 characters',
    }),
  sku: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'SKU cannot exceed 100 characters',
    }),
  price: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      'number.positive': 'Price must be a positive number',
    }),
  comparePrice: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .allow(null)
    .messages({
      'number.positive': 'Compare price must be a positive number',
    }),
  costPrice: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .allow(null)
    .messages({
      'number.positive': 'Cost price must be a positive number',
    }),
  inventoryQuantity: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.integer': 'Inventory quantity must be an integer',
      'number.min': 'Inventory quantity cannot be negative',
    }),
  trackInventory: Joi.boolean()
    .optional(),
  allowBackorders: Joi.boolean()
    .optional(),
  weight: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .allow(null)
    .messages({
      'number.positive': 'Weight must be a positive number',
    }),
  categoryId: Joi.number()
    .integer()
    .positive()
    .optional()
    .allow(null)
    .messages({
      'number.integer': 'Category ID must be an integer',
      'number.positive': 'Category ID must be a positive number',
    }),
  isActive: Joi.boolean()
    .optional(),
  featured: Joi.boolean()
    .optional(),
});

export const productQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1',
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .messages({
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100',
    }),
  search: Joi.string()
    .max(255)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Search term cannot exceed 255 characters',
    }),
  category: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.integer': 'Category must be an integer',
      'number.positive': 'Category must be a positive number',
    }),
  minPrice: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      'number.positive': 'Minimum price must be a positive number',
    }),
  maxPrice: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      'number.positive': 'Maximum price must be a positive number',
    }),
  featured: Joi.boolean()
    .optional(),
  inStock: Joi.boolean()
    .optional(),
  sortBy: Joi.string()
    .valid('name', 'price', 'createdAt', 'featured')
    .default('createdAt')
    .messages({
      'any.only': 'Sort by must be one of: name, price, createdAt, featured',
    }),
  sortOrder: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Sort order must be either asc or desc',
    }),
});

export const productParamsSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.integer': 'Product ID must be an integer',
      'number.positive': 'Product ID must be a positive number',
      'any.required': 'Product ID is required',
    }),
});

export const createCategorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.min': 'Category name must be at least 2 characters long',
      'string.max': 'Category name cannot exceed 255 characters',
      'any.required': 'Category name is required',
    }),
  description: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 1000 characters',
    }),
  imageUrl: Joi.string()
    .uri()
    .optional()
    .allow('')
    .messages({
      'string.uri': 'Image URL must be a valid URL',
    }),
  parentId: Joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      'number.integer': 'Parent ID must be an integer',
      'number.positive': 'Parent ID must be a positive number',
    }),
  isActive: Joi.boolean()
    .default(true),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .optional()
    .messages({
      'string.min': 'Category name must be at least 2 characters long',
      'string.max': 'Category name cannot exceed 255 characters',
    }),
  description: Joi.string()
    .max(1000)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Description cannot exceed 1000 characters',
    }),
  imageUrl: Joi.string()
    .uri()
    .optional()
    .allow('', null)
    .messages({
      'string.uri': 'Image URL must be a valid URL',
    }),
  parentId: Joi.number()
    .integer()
    .positive()
    .optional()
    .allow(null)
    .messages({
      'number.integer': 'Parent ID must be an integer',
      'number.positive': 'Parent ID must be a positive number',
    }),
  isActive: Joi.boolean()
    .optional(),
});