"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    // Log error details for development troubleshooting
    console.error(`[Error Handler]: ${err.name} - ${message}`);
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }
    // Mongoose duplicate key error (code 11000)
    if (err.code === 11000) {
        statusCode = 400;
        const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
        message = `A record with this ${field} already exists.`;
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(', ');
    }
    // Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Resource not found with ID: ${err.value}`;
    }
    // JSON Web Token Errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token has expired. Please log in again.';
    }
    res.status(statusCode).json({
        success: false,
        data: null,
        message
    });
};
exports.errorHandler = errorHandler;
exports.default = exports.errorHandler;
