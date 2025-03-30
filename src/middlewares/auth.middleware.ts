import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models';
import { JwtRequest } from '../interfaces/JwtRequest.interface';

/**
 * Middleware to authenticate users using JWT.
 * 
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function to pass control to the next middleware.
 * 
 * @description
 * - Extracts the JWT token from the `Authorization` header.
 * - Verifies and decodes the token.
 * - Attaches the decoded user information to `req.body.user`.
 * - Calls `next()` if authentication is successful, otherwise sends an error response.
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.header('Authorization');

        if (!token) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        token = token.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.body.user = decoded;
        next();
    } catch (error: any) {
        res.status(500).json(error);
    }
};

/**
 * Middleware to authorize users based on roles.
 * 
 * @param allowedRoles - Array of allowed user roles.
 * 
 * @returns Middleware function that checks if the authenticated user has the required role.
 * 
 * @description
 * - Extracts user data from `req.body.user`.
 * - Checks if the user's role is included in the allowed roles.
 * - If the user is not authorized, responds with a `403 Forbidden` status.
 * - Calls `next()` if authorization is successful.
 */
export const authorizeRoles = (allowedRoles: UserRole[]) => {
    return (req: JwtRequest, res: Response, next: NextFunction) => {
        const user = req.body.user;

        if (user && !allowedRoles.includes(user.role)) {
            res.status(403).json({ 
                message: `Forbidden, you are a ${user.role} and this service is only available for ${allowedRoles}` 
            });
            return;
        }
        next();
    };
};
