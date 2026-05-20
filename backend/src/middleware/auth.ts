import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUserDocument;
}

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  // Check for Token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      data: null,
      message: 'Not authorized, token is missing'
    });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret_key_123456789';
    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;

    // Fetch user details, excluding the hashed password
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({
        success: false,
        data: null,
        message: 'Not authorized, user not found'
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      data: null,
      message: 'Not authorized, invalid token'
    });
  }
};
