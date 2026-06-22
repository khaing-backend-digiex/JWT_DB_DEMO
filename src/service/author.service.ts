import { v4 as uuidv4 } from "uuid";
import { authorRepository } from "../repository/author.repository";
import type { CreateAuthorRequest, UpdateAuthorRequest } from "../dto/request/author.create.request";
import { AppException } from '../exception/app.exception';
import { HttpStatus } from "../constant/http-status.enum";
import { ErrorMessage } from "../constant/error-message.enum";

export class AuthorService {
    async createAuthor(request: CreateAuthorRequest) {
        const isNameExists = await authorRepository.checkNameExists(request.name);
        if (isNameExists) {
            throw new AppException(HttpStatus.BAD_REQUEST, ErrorMessage.NAME_ALREADY_EXISTS);
        }
        const author = await authorRepository.create({
            id: uuidv4(),
            ...request
        });
        return author;
    }
    
    async getAuthors(limit: number, offset: number) {
        const authors = await authorRepository.findAll(limit, offset);
        return authors;
    }

    async getAuthor(id: string) {
        const author = await authorRepository.findById(id);
        if (!author) {
            throw new AppException(HttpStatus.NOT_FOUND, ErrorMessage.AUTHOR_NOT_FOUND);
        }
        return author;
    }

    async updateAuthor(id: string, request: UpdateAuthorRequest) {
        const author = await authorRepository.findById(id);
        if (!author) {
            throw new AppException(HttpStatus.NOT_FOUND, ErrorMessage.AUTHOR_NOT_FOUND);
        }
        const updatedAuthor = await authorRepository.update(id, request);
        return updatedAuthor;
    }

    async deleteAuthor(id: string) {
        const author = await authorRepository.findById(id);
        if (!author) {
            throw new AppException(HttpStatus.NOT_FOUND, ErrorMessage.AUTHOR_NOT_FOUND);
        }
        await authorRepository.deleteById(id);
    }
}
