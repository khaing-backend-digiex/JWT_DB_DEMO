import type { Book } from "../interface/book.interface";
import db from '../database';

export const bookRepository = {
  async findAll(limit: number, offset: number): Promise<Book[]> {
    return db.any(
      `SELECT id, name, author_id AS "authorId", category_ids AS "categoryIds", 
              content, published_date AS "publishedDate", created_date AS "createdDate", created_by AS "createdBy"
       FROM books LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
  },

  async findById(id: string): Promise<Book | undefined> {
    const book = await db.oneOrNone(
      `SELECT id, name, author_id AS "authorId", category_ids AS "categoryIds", 
              content, published_date AS "publishedDate", created_date AS "createdDate", created_by AS "createdBy"
       FROM books WHERE id = $1`,
      [id]
    );
    return book || undefined;
  },

  async findByAuthorId(authorId: string): Promise<Book[]> {
    return db.any(
      `SELECT id, name, author_id AS "authorId", category_ids AS "categoryIds", 
              content, published_date AS "publishedDate", created_date AS "createdDate", created_by AS "createdBy"
       FROM books WHERE author_id = $1`,
      [authorId]
    );
  },

  async findByCategoryId(categoryId: string): Promise<Book[]> {
    return db.any(
      `SELECT id, name, author_id AS "authorId", category_ids AS "categoryIds", 
              content, published_date AS "publishedDate", created_date AS "createdDate", created_by AS "createdBy"
       FROM books WHERE $1 = ANY(category_ids)`,
      [categoryId]
    );
  },

  async create(book: Book): Promise<Book> {
    const result = await db.one(
      `INSERT INTO books (id, name, author_id, category_ids, content, published_date, created_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, name, author_id AS "authorId", category_ids AS "categoryIds", content, published_date AS "publishedDate", created_date AS "createdDate", created_by AS "createdBy"`,
      [
        book.id,
        book.name,
        book.authorId,
        book.categoryIds,
        book.content,
        book.publishedDate,
        book.createdDate,
        book.createdBy || null,
      ]
    );
    return result;
  },

  async update(id: string, data: Partial<Book>): Promise<Book | undefined> {
    const query = `
      UPDATE books 
      SET name = COALESCE($1, name), 
          author_id = COALESCE($2, author_id), 
          category_ids = COALESCE($3, category_ids),
          content = COALESCE($4, content),
          published_date = COALESCE($5, published_date)
      WHERE id = $6
      RETURNING id, name, author_id AS "authorId", category_ids AS "categoryIds", content, published_date AS "publishedDate", created_date AS "createdDate", created_by AS "createdBy"
    `;
    const values = [data.name, data.authorId, data.categoryIds, data.content, data.publishedDate, id];
    const result = await db.oneOrNone(query, values);
    return result || undefined;
  },

  async deleteById(id: string): Promise<boolean> {
    const result = await db.result(
      `DELETE FROM books WHERE id = $1`,
      [id]
    );
    return result.rowCount > 0;
  },
};