import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { UserRole } from '../models/User';

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
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
export default authorize;
