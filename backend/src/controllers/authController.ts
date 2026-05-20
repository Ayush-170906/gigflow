import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// Helper to sign JWT
const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'dev_jwt_secret_key_123456789';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id }, secret, { expiresIn: expiresIn as any });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      data: null,
      message: errors.array().map(e => e.msg).join(', ')
    });
    return;
  }

  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({
        success: false,
        data: null,
        message: 'A user with this email already exists'
      });
      return;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'sales'
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user and get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      data: null,
      message: errors.array().map(e => e.msg).join(', ')
    });
    return;
  }

  const { email, password } = req.body;

  try {
    // Find user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid email or password'
      });
      return;
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        data: null,
        message: 'Invalid email or password'
      });
      return;
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      },
      message: 'Logged in successfully'
    });
  } catch (error) {
    next(error);
  }
};
