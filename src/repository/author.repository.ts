import type { Author } from "../models/author.entity";
import db from '../database';

export const authorRepository = {
  async findAll( limit: number , offset: number ): Promise<Author[]> {
    return db.any('SELECT * FROM authors LIMIT $1 OFFSET $2', [limit, offset]);
  },

  async findById(id: string): Promise<Author | undefined> {
    const author = await db.oneOrNone('SELECT * FROM authors WHERE id = $1', [id]);
    return author ?? undefined;
  },

  async create(author: Author): Promise<Author> {
    const query = `
      INSERT INTO authors (id, name) 
      VALUES ($1, $2) 
      RETURNING *
    `;
    return db.one(query, [author.id, author.name]);
  },

  async update(id: string, data: Partial<Author>): Promise<Author | undefined> {
    const query = `
      UPDATE authors 
      SET name = COALESCE($1, name)
      WHERE id = $2 
      RETURNING *
    `;
    const author = await db.oneOrNone(query, [data.name, id]);
    return author ?? undefined;
  },

  async deleteById(id: string): Promise<boolean> {
    const result = await db.result('DELETE FROM authors WHERE id = $1', [id]);
    return result.rowCount > 0;
  },
  async checkNameExists(name: string): Promise<boolean> {
    const query = 'SELECT EXISTS(SELECT 1 FROM authors WHERE name = $1)';
    const result = await db.one(query, [name]);
    return result.exists; 
  },
};
