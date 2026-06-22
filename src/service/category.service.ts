import { v4 as uuidv4 } from "uuid";
import { categoryRepository } from "../repository/category.repository";
import { AppException } from '../exception/app.exception';
import { HttpStatus } from "../constant/http-status.enum";
import { ErrorMessage } from "../constant/error-message.enum";
import type { CreateCategoryRequest } from "../dto/request/category.create.request";

export class CategoryService {
    async createCategory(request: CreateCategoryRequest) {
        const categories = await categoryRepository.findAll();
        const existing = categories.find((c) => c.name === request.name);
        if (existing) {
            throw new AppException(HttpStatus.BAD_REQUEST, ErrorMessage.NAME_ALREADY_EXISTS);
        }

        const category = await categoryRepository.create({
            id: uuidv4(),
            ...request,
        });
        return category;
    }

    async getAllCategories() {
        return await categoryRepository.findAll();
    }

    async getCategoryById(id: string) {
        const category = await categoryRepository.findById(id);
        if (!category) {
            throw new AppException(HttpStatus.NOT_FOUND, ErrorMessage.CATEGORY_NOT_FOUND);
        }
        return category;
    }
}
