import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'infiniteforever';

// console.log('JWT Secret:', JWT_SECRET);

export interface AuthenticatedRequest extends Request {
    user?: { userId: string; email: string }; 
}

export function authenticateToken(
    req: AuthenticatedRequest,
    res: Response, next:
        NextFunction): void {
    // Getting the token from the Authorization header
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'No token provided.' });
        return;
    }

    const token = authHeader.split(' ')[1];
    // console.log('Received token:', token);

    if (!token) {
        logger.warn('Authentication failed: No token provided')
        res.status(401).json({ success: false, message: "No token provided, authorization denied." });
        return;
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            logger.error(`Token verfitication failed: ${err.message}`)
            console.error('Token verification failed:', err);
            return res.status(403).json({ success: false, message: `Invalid token. ${err}`});
        }

    // Attach decoded payload to the request
        req.user = decoded as { userId: string; email: string }; 
        next();
    });
}