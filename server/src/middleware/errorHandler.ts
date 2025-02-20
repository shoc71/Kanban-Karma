import { Request, Response, NextFunction } from "express";

// Custom error interface
interface AppError extends Error {
    status?: number;
}

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    console.error(`[ERROR] ${statusCode} - ${message}`)

    res.status(statusCode).json({
        success: false,
        message
    });
}