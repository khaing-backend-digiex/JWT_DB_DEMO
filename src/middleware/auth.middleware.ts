import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Role, HttpStatus, ErrorMessage } from "../constant/enum";
import { UserRepository } from "../repository/user.repository";
import { AppException } from "../exception/app.exception";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        username: string;
        roles: string[];
    };
}

export const authMiddleware = (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppException(HttpStatus.UNAUTHORIZED, ErrorMessage.UNAUTHORIZED));
    }

    const token = authHeader.split(" ")[1]!;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as unknown as {
            id: string;
            username: string;
            roles: string[];
        };

        req.user = { id: parseInt(decoded.id), username: decoded.username, roles: decoded.roles || [] };
        
        next();
    } catch (error) {
        return next(new AppException(HttpStatus.UNAUTHORIZED, "Invalid token"));
    }
};

export const authorize = (allowedRoles: string[]) => {
    return (req: AuthRequest, _res: Response, next: NextFunction): void => {
        const userRoles = req.user?.roles;

        if (!userRoles || userRoles.length === 0) {
            return next(new AppException(HttpStatus.FORBIDDEN, ErrorMessage.FORBIDDEN, "Access denied. No role assigned."));
        }

        const hasPermission = userRoles.some((role: string) => allowedRoles.includes(role));

        if (!hasPermission) {
            return next(new AppException(HttpStatus.FORBIDDEN, ErrorMessage.FORBIDDEN, "Access denied. Insufficient permissions."));
        }

        next();
    };
};

export const authorizeDynamic = () => {
    return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
        try {
            const userRoles = req.user?.roles || [];
            const currentUsername = req.user?.username;

            if (!userRoles || userRoles.length === 0) {
                return next(new AppException(HttpStatus.FORBIDDEN, ErrorMessage.FORBIDDEN, "Access denied. No role assigned."));
            }

            if (userRoles.includes(Role.admin)) {
                return next();
            }

            const targetId = req.params.id as string | undefined;

            if (userRoles.includes(Role.manager)) {
                if (req.method === 'DELETE' || req.method === 'PUT' || req.method === 'PATCH') {
                    if (targetId) {
                        const userRepository = new UserRepository();
                        const targetUser = await userRepository.findByUserName(targetId);
                        if (targetUser) {
                            const targetRoles = targetUser.roles || [];
                            if (targetRoles.includes(Role.manager) || targetRoles.includes(Role.admin)) {
                                return next(new AppException(HttpStatus.FORBIDDEN, ErrorMessage.FORBIDDEN, "Manager cannot update or delete other managers or admins."));
                            }
                        }
                    }
                }
                return next();
            }

            if (userRoles.includes(Role.user)) {
                if (targetId && targetId === currentUsername) {
                    return next();
                }
                return next(new AppException(HttpStatus.FORBIDDEN, ErrorMessage.FORBIDDEN, "Access denied. You can only access your own resources."));
            }

            return next(new AppException(HttpStatus.FORBIDDEN, ErrorMessage.FORBIDDEN, "Access denied. Insufficient permissions."));
        } catch (error) {
            return next(new AppException(HttpStatus.INTERNAL_SERVER_ERROR, ErrorMessage.INTERNAL_ERROR));
        }
    };
};
