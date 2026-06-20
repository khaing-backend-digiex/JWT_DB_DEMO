import type { Request, Response } from "express";
import { AuthorService } from "../service/author.service";
import { HttpStatus } from "../constant/enum";
import { ApiResponse } from "../dto/response/api.response";
import { ValidationError, validateCreateAuthor } from "../validates/validated";
import { AppException } from "../exception/app.exception";
import { catchAsync } from "../utils/async.handler";

const authorService = new AuthorService();

export class AuthorController {
  createAuthor = catchAsync(async (req: Request, res: Response): Promise<void> => {
    try {
      const parsedBody = validateCreateAuthor(req.body);
      const result = await authorService.createAuthor(parsedBody);
      res.status(HttpStatus.CREATED).json(new ApiResponse(HttpStatus.CREATED, "Author created successfully", result));
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new AppException(HttpStatus.BAD_REQUEST, "Validation failed", error.issues.map((e) => e.message));
      }
      throw error;
    }
  });

  getAllAuthors = catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const result = await authorService.getAuthors();
    res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "Authors retrieved successfully", result));
  });

  getAuthorById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const result = await authorService.getAuthor(id);
    res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "Author found successfully", result));
  });

  updateAuthor = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const result = await authorService.updateAuthor(id, req.body);
    res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "Author updated successfully", result));
  });

  deleteAuthor = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await authorService.deleteAuthor(id);
    res.status(HttpStatus.NO_CONTENT).send();
  });
}
