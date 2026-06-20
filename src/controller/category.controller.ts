import type { Request, Response } from "express";
import { CategoryService } from "../service/category.service";
import { HttpStatus } from "../constant/enum";
import { ValidationError, validateCreateCategory } from "../validates/validated";
import { ApiResponse } from "../dto/response/api.response";
import { catchAsync } from "../utils/async.handler";
import { AppException } from "../exception/app.exception";

const categoryService = new CategoryService();

export class CategoryController {
  createCategory = catchAsync(async (req: Request, res: Response): Promise<void> => {
    try {
      const parsedBody = validateCreateCategory(req.body);
      const result = await categoryService.createCategory(parsedBody);
      res.status(HttpStatus.CREATED).json(new ApiResponse(HttpStatus.CREATED, "Category created successfully", result));
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new AppException(HttpStatus.BAD_REQUEST, "Validation failed", error.issues.map((e) => e.message));
      }
      throw error;
    }
  });

  getAllCategories = catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const result = await categoryService.getAllCategories();
    res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "Categories retrieved successfully", result));
  });

  getCategoryById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const result = await categoryService.getCategoryById(id);
    res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "Category found successfully", result));
  });
}
