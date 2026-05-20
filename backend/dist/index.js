"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const leadRoutes_1 = __importDefault(require("./routes/leadRoutes"));
const errorHandler_1 = require("./middleware/errorHandler");
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to Database
(0, database_1.connectDB)();
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/leads', leadRoutes_1.default);
// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        data: { status: 'OK', timestamp: new Date() },
        message: 'Backend service is healthy'
    });
});
// Fallback 404 handler for unmatched routes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        data: null,
        message: `Cannot find ${req.method} ${req.originalUrl} on this server`
    });
});
// Centralized error handler
app.use(errorHandler_1.errorHandler);
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
