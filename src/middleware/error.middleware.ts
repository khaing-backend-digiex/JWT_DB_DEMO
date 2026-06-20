import { Request, Response, NextFunction } from 'express';
import { AppException } from '../exception/app.exception';
import { ApiResponse } from '../dto/response/api.response';
import { HttpStatus } from '../constant/enum';

export const globalErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error(`[Error] ${req.method} ${req.url} - ${err.message}`);

    if (err instanceof AppException) {
        res.status(err.statusCode).json(new ApiResponse(err.statusCode, err.message, err.data || ""));
        return;
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
        new ApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", err.message)
    );
};
