import type { Request, Response } from "express";
import { BookService } from "../service/book.service";
import type { BookQueryRequest } from "../dto/request/book.create.request";
import { HttpStatus } from "../constant/enum";
import { ApiResponse } from "../dto/response/api.response";
import { ValidationError, validateBookQuery, validateCreateBook, validateUpdateBook } from "../validates/validated";
import { AppException } from "../exception/app.exception";
import { catchAsync } from "../utils/async.handler";

const bookService = new BookService();

export class BookController {
    createBook = catchAsync(async (req: Request, res: Response): Promise<void> => {
        try {
            const parsedBody = validateCreateBook(req.body);
            const result = await bookService.createBook(parsedBody);
            res.status(HttpStatus.CREATED).json(new ApiResponse(HttpStatus.CREATED, "Book created successfully", result));
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Validation failed", error.issues.map((e) => e.message));
            }
            throw error;
        }
    });

    updateBook = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const id = req.query.id as string;
        if (!id) {
            throw new AppException(HttpStatus.BAD_REQUEST, "id query param is required");
        }
        try {
            const parsedBody = validateUpdateBook(req.body);
            const result = await bookService.updateBook(id, parsedBody);
            res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "Book updated successfully", result));
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Validation failed", error.issues.map((e) => e.message));
            }
            throw error;
        }
    });

    deleteBook = catchAsync(async (req: Request, res: Response): Promise<void> => {
        const id = req.query.id as string;
        if (!id) {
            throw new AppException(HttpStatus.BAD_REQUEST, "id query param is required");
        }
        await bookService.deleteBook(id);
        res.status(HttpStatus.NO_CONTENT).send();
    });

    getBooks = catchAsync(async (req: Request, res: Response): Promise<void> => {
        try {
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
                sortOrder?: string;
            }
            const query = validateBookQuery({ categoryId, authorId, limit, offset, sortBy, sortOrder }) as BookQueryRequest;
            const result = await bookService.getBooksByFilter(query);
            res.status(HttpStatus.OK).json(new ApiResponse(HttpStatus.OK, "Books fetched successfully", result));

        } catch (error) {
            if (error instanceof ValidationError) {
                throw new AppException(HttpStatus.BAD_REQUEST, "Validation failed", error.issues.map((e) => e.message));
            }
            throw error;
        }
    });
}
