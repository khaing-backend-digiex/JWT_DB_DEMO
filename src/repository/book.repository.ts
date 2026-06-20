import type { Book } from "../models/book.entity";
import db from '../database';

export const bookRepository = {
  async findAll(): Promise<Book[]> {
    const result = await db.any(
      `
      SELECT *
      FROM books
    `);
    return result;
  },

  async findById(id: string): Promise<Book> {
    const result = await db.oneOrNone(`
      SELECT * 
      FROM books 
      WHERE id = $1
      `, [id]);
    return result;
  },

  async findByAuthorId(authorId: string): Promise<Book[]> {
    const result = await db.any(`
      SELECT * 
      FROM books 
      WHERE author_id = $1
    `, [authorId]);
    return result;
  },
  async findByCategoryId(categoryId: string): Promise<Book[]> {
    const result = await db.any(`
      SELECT * 
      FROM books 
      WHERE $1 = ANY(category_ids)
      `, [categoryId]);
    return result;
  },
  async create(book: Book): Promise<Book> {

    const query = `
      INSERT INTO books (id, name, author_id, category_ids, content, published_date, created_date) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *
    `;
    const values = [book.id, book.name, book.authorId, book.categoryIds, book.content, book.publishedDate, book.createdDate];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async update(id: string, data: Partial<Book>): Promise<Book | undefined> {

    const query = `
      UPDATE books 
      SET name = COALESCE($1, name), 
          author_id = COALESCE($2, author_id), 
          category_ids = COALESCE($3, category_ids)
      WHERE id = $4 
      RETURNING *
    `;
    const values = [data.name, data.authorId, data.categoryIds, id];

    const result = await db.query(query, values);
    return result.rows[0];
  },
  async deleteById(id: string): Promise<boolean> {
    const result = await db.query(`
      DELETE 
      FROM books 
      WHERE id = $1
      `, [id]);
    return (result.rowCount ?? 0) > 0;
  },
};