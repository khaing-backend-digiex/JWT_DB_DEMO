import { AppException } from '../exception/app.exception';
import { v4 as uuidv4 } from 'uuid';
import { bookRepository } from '../repository/book.repository';
import type { CreateBookRequest, UpdateBookRequest, BookQueryRequest } from '../dto/request/book.create.request';
import { HttpStatus } from '../constant/http-status.enum';
import { ErrorMessage } from '../constant/error-message.enum';
import { Role } from '../constant/role.enum';
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

  async getAllBook(limit: number, offset: number) {
    const books = await bookRepository.findAll(limit, offset);
    return books;
  }

  async getBookByAuthorId(authorId: string) {
    if (!await authorRepository.findById(authorId)) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorMessage.AUTHOR_NOT_FOUND);
    }
    const books = await bookRepository.findByAuthorId(authorId);
    return books;
  }

  async getBookDetail(id: string) {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorMessage.BOOK_NOT_FOUND);
    }
    return book;
  }

  async getBookByFilter(query: BookQueryRequest) {
    const { id, name, authorId, categoryId, page = 1, offset = 0, limit = 10, sortBy = 'createdDate', sortOrder = 'desc' } = query;
    const books = await bookRepository.findAll(offset, limit);
    let filteredBooks = books;

    if (id) {
      filteredBooks = filteredBooks.filter(book => book.id === id);
    }
    if (name) {
      filteredBooks = filteredBooks.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (authorId) {
      filteredBooks = filteredBooks.filter(book => book.authorId === authorId);
    }
    if (categoryId) {
      filteredBooks = filteredBooks.filter(book => book.categoryIds.includes(categoryId));
    }

    const sortedBooks = filteredBooks.sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];
      if (aValue! < bValue!) return sortOrder === 'asc' ? -1 : 1;
      if (aValue! > bValue!) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const paginatedBooks = sortedBooks.slice((page - 1) * limit, page * limit);
    return paginatedBooks;
  }
}
