import { AppException } from '../exception/app.exception';
import { v4 as uuidv4 } from 'uuid';
import { bookRepository } from '../repository/book.repository';
import type { CreateBookRequest, UpdateBookRequest, BookQueryRequest } from '../dto/request/book.create.request';
import { ErrorMessage, HttpStatus, Role } from '../constant/enum';
import { authorRepository } from '../repository/author.repository';

export class BookService {
  public async getBook(id: string) {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorMessage.BOOK_NOT_FOUND);
    }
    return book;
  }

  async createBook(request: CreateBookRequest, userId?: number) {
    const { name, authorId, categoryIds, content, publishedDate } = request;
    const newBookData: any = {
      id: uuidv4(),
      ...request,
      createdDate: new Date().toISOString().split('T')[0]!,
    };
    if (userId !== undefined) {
      newBookData.createdBy = userId;
    }
    const book = await bookRepository.create(newBookData);
    return book;
  }

  async updateBook(id: string, request: UpdateBookRequest, user?: { id: number, roles: string[] }) {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorMessage.BOOK_NOT_FOUND);
    }
    if (user && user.roles.includes(Role.user) && !user.roles.includes(Role.admin) && !user.roles.includes(Role.manager)) {
      if (book.createdBy !== user.id) {
        throw new AppException(HttpStatus.FORBIDDEN, ErrorMessage.FORBIDDEN, "Bạn không có quyền sửa sách của người khác");
      }
    }
    const updatedBook = await bookRepository.update(id, request);
    return updatedBook;
  }

  async deleteBook(id: string, user?: { id: number, roles: string[] }) {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorMessage.BOOK_NOT_FOUND);
    }
    if (user && user.roles.includes(Role.user) && !user.roles.includes(Role.admin) && !user.roles.includes(Role.manager)) {
      if (book.createdBy !== user.id) {
        throw new AppException(HttpStatus.FORBIDDEN, ErrorMessage.FORBIDDEN, "Bạn không có quyền xóa sách của người khác");
      }
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
          return (a[sortBy] ?? 0) > (b[sortBy] ?? 0) ? 1 : -1;
        } else {
          return (a[sortBy] ?? 0) < (b[sortBy] ?? 0) ? 1 : -1;
        }
      });
    }

    if (query.offset !== undefined && query.limit !== undefined) {
      const offset = query.offset as number;
      const limit = query.limit as number;
      result = result.slice(offset, offset + limit);
    } else if (query.page !== undefined && query.limit !== undefined) {
      const limit = query.limit as number;
      const page = query.page as number;
      const startIndex = (page - 1) * limit;
      result = result.slice(startIndex, startIndex + limit);
    }

    return result;
  }
}
