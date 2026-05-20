"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
// Helper to sign JWT
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || 'dev_jwt_secret_key_123456789';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jsonwebtoken_1.default.sign({ id }, secret, { expiresIn: expiresIn });
};
/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
    // Check validation results
    const errors = (0, express_validator_1.validationResult)(req);
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
        const userExists = await User_1.User.findOne({ email });
        if (userExists) {
            res.status(400).json({
                success: false,
                data: null,
                message: 'A user with this email already exists'
            });
            return;
        }
        // Create user
        const user = await User_1.User.create({
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
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
/**
 * @desc    Authenticate user and get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
    // Check validation results
    const errors = (0, express_validator_1.validationResult)(req);
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
        const user = await User_1.User.findOne({ email }).select('+password');
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
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
