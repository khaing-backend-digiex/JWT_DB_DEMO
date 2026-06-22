import type { Request, Response } from "express";
import { AuthenticationService } from "../service/authentication.service";
import { HttpStatus } from "../constant/http-status.enum";
import { ApiResponse } from "../dto/response/api.response";
import { catchAsync } from "../utils/async.handler";

const authenticationService = new AuthenticationService();

export class AuthenticationController {
    login = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const { username, password } = req.body || {};
        const result = await authenticationService.login(username, password);
        res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "User logged in successfully", result));
    });

    register = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const { username, password, name, email, dateOfBirth } = req.body || {};
        const result = await authenticationService.register(username, password, name, email, dateOfBirth);
        res.status(HttpStatus.CREATED).json(new ApiResponse(HttpStatus.CREATED, "User registered successfully", result));
    });
}