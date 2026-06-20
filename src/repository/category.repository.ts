import type { Category } from "../models/category.entity";
import db from '../database';

export const categoryRepository = {
  async findAll(): Promise<Category[]> {
    const categories = await db.any<Category>('SELECT * FROM categories');
    return categories;
  },

  async findById(id: string): Promise<Category> {
    const category = await db.one<Category>('SELECT * FROM categories WHERE id = $1', [id]);
    return category;
  },

  async findByIds(ids: string[]): Promise<Category[]> {
    const categories = await db.any<Category>('SELECT * FROM categories WHERE id = ANY($1)', [ids]);
    return categories;
  },

  async allExist(ids: string[]): Promise<boolean> {
    if (ids.length === 0) return true;
    const uniqueIds = Array.from(new Set(ids));
    const foundCategories = await db.any('SELECT id FROM categories WHERE id = ANY($1)', [uniqueIds]);
    return foundCategories.length === uniqueIds.length;
  },

  async create(category: Category): Promise<Category> {
    const query = `
      INSERT INTO categories (id, name) 
      VALUES ($1, $2) 
      RETURNING *
    `;
    return db.one(query, [category.id, category.name]);
  },
};
