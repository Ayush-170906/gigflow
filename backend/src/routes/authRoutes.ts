import { Router } from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/authController';

const router = Router();

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role')
      .optional()
      .isIn(['admin', 'sales'])
      .withMessage('Role must be either admin or sales')
  ],
  register
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  login
);

export default router;
