"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                data: null,
                message: 'Not authenticated, user context missing'
            });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                data: null,
                message: `Forbidden: role '${req.user.role}' does not have permission to perform this action`
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
exports.default = exports.authorize;
