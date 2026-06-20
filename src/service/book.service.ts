import { AppException } from '../exception/app.exception';
import { v4 as uuidv4 } from 'uuid';
import { bookRepository } from '../repository/book.repository';
import type { CreateBookRequest, UpdateBookRequest, BookQueryRequest } from '../dto/request/book.create.request';
import { ErrorMessage, HttpStatus } from '../constant/enum';
import { authorRepository } from '../repository/author.repository';

export class BookService {
  public async getBook(id: string) {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorMessage.BOOK_NOT_FOUND);
    }
    return book;
  }

  async createBook(request: CreateBookRequest) {
    const { name, authorId, categoryIds, content, publishedDate } = request;
    if (!name || !authorId || !categoryIds || !content || !publishedDate) {
      throw new AppException(HttpStatus.BAD_REQUEST, ErrorMessage.VALIDATION_FAILED);
    }
    const book = await bookRepository.create({
      id: uuidv4(),
      ...request,
      createdDate: new Date().toISOString().split('T')[0]!,
    });
    return book;
  }

  async updateBook(id: string, request: UpdateBookRequest) {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorMessage.BOOK_NOT_FOUND);
    }
    const updatedBook = await bookRepository.update(id, request);
    return updatedBook;
  }

  async deleteBook(id: string) {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorMessage.BOOK_NOT_FOUND);
    }
    const deletedBook = await bookRepository.deleteById(id);
    return deletedBook;
  }

  async getAllBook() {
    const books = await bookRepository.findAll();
    return books;
  }

  async getBookByAuthorId(authorId: string) {
    if (!await authorRepository.findById(authorId)) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorMessage.AUTHOR_NOT_FOUND);
    }
    const allBooks = await bookRepository.findAll();
    const books = allBooks.filter((book) => book.authorId === authorId);
    return books;
  }

  async getBookDetail(id: string) {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorMessage.BOOK_NOT_FOUND);
    }
    return book;
  }

  async getBooksByFilter(query: BookQueryRequest) {
    let result = await bookRepository.findAll();

    if (query.id) {
      result = result.filter((book) => book.id === query.id);
    }
    if (query.authorId) {
      result = result.filter((book) => book.authorId === query.authorId);
    }
    if (query.categoryId) {
      result = result.filter((book) => book.categoryIds.includes(query.categoryId!));
    }
    if (query.name) {
      result = result.filter((book) => book.name.includes(query.name!));
    }

    if (query.sortBy && query.sortOrder) {
      result = result.sort((a, b) => {
        const sortBy = query.sortBy as keyof typeof a;
        if (query.sortOrder === 'asc') {
          return a[sortBy] > b[sortBy] ? 1 : -1;
        } else {
          return a[sortBy] < b[sortBy] ? 1 : -1;
        }
      });
    }

    if (query.offset !== undefined && query.limit !== undefined) {
      result = result.slice(query.offset, query.offset + query.limit);
    } else if (query.page !== undefined && query.limit !== undefined) {
      const startIndex = (query.page - 1) * query.limit;
      result = result.slice(startIndex, startIndex + query.limit);
    }

    return result;
  }
}
