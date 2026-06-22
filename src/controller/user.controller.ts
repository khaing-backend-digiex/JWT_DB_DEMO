import { ApiResponse } from "../dto/response/api.response";
import { HttpStatus } from "../constant/http-status.enum";
import { UserService } from "../service/user.service";
import { Request, Response } from "express";
import { catchAsync } from "../utils/async.handler";

const userService = new UserService();

export class UserController {
    createUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const user = await userService.createUser(req.body);
        res.status(HttpStatus.CREATED).json(new ApiResponse(HttpStatus.CREATED, "User created successfully", user));
    });

    getUsers = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const users = await userService.getUsers(parseInt(req.query.limit as string, 10) || 10, parseInt(req.query.offset as string, 10) || 0);
        res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "Users fetched successfully", users));
    });

    deleteUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params as { id: string };
        const user = await userService.deleteUser(id);
        res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "User deleted successfully", user));
    });

    getUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params as { id: string };
        const user = await userService.getUser(id);
        res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "User fetched successfully", user));
    });

    updateUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params as { id: string };
        const user = await userService.updateUser(id, req.body);
        res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "User updated successfully", user));
    });
}