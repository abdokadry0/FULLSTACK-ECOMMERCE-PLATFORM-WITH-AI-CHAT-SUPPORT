import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyPassword } from '../utils/password';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { redisClient } from '../config/redis';
import { AuthenticatedRequest, ApiResponse, CreateUserData, LoginData } from '../types';
import { AppError } from '../types';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone }: CreateUserData = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(409).json(response);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash: hashedPassword,
        firstName,
        lastName,
        phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate tokens
    const tokens = generateTokens(user.id.toString());

    // Store refresh token in Redis
    await redisClient.setEx(`refresh_token:${user.id}`, 7 * 24 * 60 * 60, tokens.refreshToken);

    const response: ApiResponse = {
      success: true,
      data: {
        user,
        tokens,
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to register user',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginData = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(401).json(response);
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(401).json(response);
    }

    // Generate tokens
    const tokens = generateTokens(user.id.toString());

    // Store refresh token in Redis
    await redisClient.setEx(`refresh_token:${user.id}`, 7 * 24 * 60 * 60, tokens.refreshToken);

    // Remove passwordHash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    const response: ApiResponse = {
      success: true,
      data: {
        user: userWithoutPassword,
        tokens,
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Login error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to login',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'REFRESH_TOKEN_REQUIRED',
          message: 'Refresh token is required',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(400).json(response);
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if refresh token exists in Redis
    const storedToken = await redisClient.get(`refresh_token:${decoded.userId}`);

    if (!storedToken || storedToken !== refreshToken) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: 'Invalid or expired refresh token',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(401).json(response);
    }

    // Generate new tokens
    const tokens = generateTokens(decoded.userId);

    // Update refresh token in Redis
    await redisClient.setEx(`refresh_token:${decoded.userId}`, 7 * 24 * 60 * 60, tokens.refreshToken);

    const response: ApiResponse = {
      success: true,
      data: { tokens },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Refresh token error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to refresh token',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
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

    // Remove refresh token from Redis
    await redisClient.del(`refresh_token:${req.user.userId}`);

    const response: ApiResponse = {
      success: true,
      data: { message: 'Logged out successfully' },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Logout error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to logout',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
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

    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.user.userId) },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
        },
        timestamp: new Date().toISOString(),
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse = {
      success: true,
      data: { user },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Get profile error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get profile',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
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

    const { firstName, lastName, phone } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(req.user.userId) },
      data: {
        firstName,
        lastName,
        phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const response: ApiResponse = {
      success: true,
      data: { user: updatedUser },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Update profile error:', error);
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update profile',
      },
      timestamp: new Date().toISOString(),
    };
    return res.status(500).json(response);
  }
};