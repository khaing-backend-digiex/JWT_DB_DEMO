import type { Request, Response } from "express";
import { BookService } from "../service/book.service";
import type { BookQueryRequest } from "../dto/request/book.create.request";
import { HttpStatus } from "../constant/http-status.enum";
import { ApiResponse } from "../dto/response/api.response";
import { AppException } from "../exception/app.exception";
import { catchAsync } from "../utils/async.handler";
import type { AuthRequest } from "../middleware/auth.middleware";

const bookService = new BookService();

export class BookController {
    createBook = catchAsync(async (req: AuthRequest, res: Response): Promise<void> => {
        const result = await bookService.createBook(req.body, req.user?.id);
        res.status(HttpStatus.CREATED).json(new ApiResponse(HttpStatus.CREATED, "Book created successfully", result));
    });

    updateBook = catchAsync(async (req: AuthRequest, res: Response): Promise<void> => {
        const id = req.query.id as string;
        if (!id) {
            throw new AppException(HttpStatus.BAD_REQUEST, "id query param is required");
        }
        const result = await bookService.updateBook(id, req.body, req.user);
        res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "Book updated successfully", result));
    });

    deleteBook = catchAsync(async (req: AuthRequest, res: Response): Promise<void> => {
        const id = req.query.id as string;
        if (!id) {
            throw new AppException(HttpStatus.BAD_REQUEST, "id query param is required");
        }
        await bookService.deleteBook(id, req.user);
        res.status(HttpStatus.NO_CONTENT).send();
    });

    getBooks = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const { categoryId,
            authorId,
            limit,
            offset,
            sortBy,
            sortOrder
        } = req.query as {
            categoryId?: string;
            authorId?: string;
            limit?: string;
            offset?: string;
            sortBy?: string;
            sortOrder?: 'asc' | 'desc';
        };
        const query: BookQueryRequest = {};
        if (categoryId !== undefined) query.categoryId = categoryId;
        if (authorId !== undefined) query.authorId = authorId;
        if (limit !== undefined) query.limit = Number(limit);
        if (offset !== undefined) query.offset = Number(offset);
        if (sortBy !== undefined) query.sortBy = sortBy;
        if (sortOrder !== undefined) query.sortOrder = sortOrder;
        const result = await bookService.getBookByFilter(query);
        res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "Books fetched successfully", result));
    });
    getAllBooks = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
        const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
        const safeLimit = Math.max(1, limit); 
        const safeOffset = Math.max(0, offset);
        const result = await bookService.getAllBook(safeLimit, safeOffset);
        res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "Books fetched successfully", result));
    });
}
