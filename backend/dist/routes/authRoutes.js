"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('role')
        .optional()
        .isIn(['admin', 'sales'])
        .withMessage('Role must be either admin or sales')
], authController_1.register);
// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required')
], authController_1.login);
exports.default = router;
