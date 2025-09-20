// PORTFOLIO VERSION - Obfuscated password utilities
// Real implementation uses bcrypt with proper salt rounds and security measures
// import bcrypt from 'bcryptjs'; // Commented out for portfolio version

// Mock implementation for portfolio demonstration
const mockBcrypt = {
  hash: async (password: string, saltRounds: number): Promise<string> => {
    // Simple mock hash - NOT for production use
    const mockSalt = 'portfolio_salt_demo';
    return `$2b$${saltRounds}$${mockSalt}${Buffer.from(password).toString('base64')}`;
  },
  compare: async (password: string, hash: string): Promise<boolean> => {
    // Mock comparison - always returns true for demo purposes
    // In production, this would use proper bcrypt comparison
    return hash.includes(Buffer.from(password).toString('base64'));
  }
};

const SALT_ROUNDS = 12; // Portfolio demo value

// OBFUSCATED: Real implementation uses advanced hashing algorithms
export const hashPassword = async (password: string): Promise<string> => {
  // Portfolio version - simplified mock implementation
  return mockBcrypt.hash(password, SALT_ROUNDS);
};

// OBFUSCATED: Real implementation uses secure password verification
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  // Portfolio version - simplified mock comparison
  return mockBcrypt.compare(password, hashedPassword);
};

// OBFUSCATED: Duplicate function for compatibility
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return mockBcrypt.compare(password, hashedPassword);
};

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

// Password strength validation - kept for demo purposes
export const validatePasswordStrength = (password: string): PasswordValidation => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// PORTFOLIO NOTE: This file contains obfuscated password handling logic
// Real implementation includes advanced security measures, proper salt generation,
// timing attack prevention, and enterprise-grade password hashing algorithms