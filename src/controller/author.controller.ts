import type { Request, Response } from "express";
import { AuthorService } from "../service/author.service";
import { HttpStatus } from "../constant/http-status.enum";
import { ApiResponse } from "../dto/response/api.response";
import { AppException } from "../exception/app.exception";
import { catchAsync } from "../utils/async.handler";

const authorService = new AuthorService();

export class AuthorController {
  createAuthor = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await authorService.createAuthor(req.body);
    res.status(HttpStatus.CREATED).json(new ApiResponse(HttpStatus.CREATED, "Author created successfully", result));
  });

  getAllAuthors = catchAsync(async (_req: Request, res: Response): Promise<void> => {
    const limit = _req.query.limit ? parseInt(_req.query.limit as string, 10) : 10;
    const offset = _req.query.offset ? parseInt(_req.query.offset as string, 10) : 0;
    const safeLimit = Math.max(1, limit); 
    const safeOffset = Math.max(0, offset);
    const result = await authorService.getAuthors(safeLimit, safeOffset);
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
