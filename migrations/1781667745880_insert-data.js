/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // ===== AUTHORS =====
  pgm.sql(`
    INSERT INTO authors (id, name) VALUES
      ('00000000-0000-0000-0000-000000000001', 'J.K Rowling'),
      ('00000000-0000-0000-0000-000000000002', 'Nguyễn Nhật Ánh'),
      ('00000000-0000-0000-0000-000000000003', 'Tô Hoài'),
      ('00000000-0000-0000-0000-000000000004', 'Paulo Coelho'),
      ('00000000-0000-0000-0000-000000000005', 'Dale Carnegie');
  `);

  // ===== CATEGORIES =====
  pgm.sql(`
    INSERT INTO categories (id, name) VALUES
      ('10000000-0000-0000-0000-000000000001', 'Fantasy'),
      ('10000000-0000-0000-0000-000000000002', 'Adventure'),
      ('10000000-0000-0000-0000-000000000003', 'Văn học'),
      ('10000000-0000-0000-0000-000000000004', 'Thiếu nhi'),
      ('10000000-0000-0000-0000-000000000005', 'Tâm lý - Kỹ năng sống');
  `);

  // ===== USERS =====
  pgm.sql(`
    INSERT INTO users (username, password, name, email, "dataOfBirth") VALUES
      ('admin', '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', 'Admin User', 'admin@example.com', '1990-01-15'),
      ('nguyenvana', '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', 'Nguyễn Văn A', 'vana@example.com', '1995-06-20'),
      ('tranthib', '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012', 'Trần Thị B', 'thib@example.com', '1998-03-10');
  `);

  // ===== BOOKS =====
  pgm.sql(`
    INSERT INTO books (id, name, author_id, category_ids, content, published_date, created_date) VALUES
      (
        '20000000-0000-0000-0000-000000000001',
        'Harry Potter',
        '00000000-0000-0000-0000-000000000001',
        ARRAY['10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'],
        'hello',
        '2025-01-01',
        '2025-06-12'
      ),
      (
        '20000000-0000-0000-0000-000000000002',
        'Mắt Biếc',
        '00000000-0000-0000-0000-000000000002',
        ARRAY['10000000-0000-0000-0000-000000000003'],
        'Mắt Biếc là một truyện dài của nhà văn Nguyễn Nhật Ánh.',
        '1990-01-01',
        '2025-06-12'
      ),
      (
        '20000000-0000-0000-0000-000000000003',
        'Dế Mèn Phiêu Lưu Ký',
        '00000000-0000-0000-0000-000000000003',
        ARRAY['10000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000004'],
        'Cuộc phiêu lưu của chú Dế Mèn.',
        '1941-01-01',
        '2025-06-12'
      ),
      (
        '20000000-0000-0000-0000-000000000004',
        'The Alchemist',
        '00000000-0000-0000-0000-000000000004',
        ARRAY['10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002'],
        'A journey of Santiago to the Egyptian pyramids.',
        '1988-01-01',
        '2025-06-12'
      ),
      (
        '20000000-0000-0000-0000-000000000005',
        'How to Win Friends and Influence People',
        '00000000-0000-0000-0000-000000000005',
        ARRAY['10000000-0000-0000-0000-000000000005'],
        'A self-help book about interpersonal skills.',
        '1936-10-01',
        '2025-06-12'
      );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.sql(`DELETE FROM books;`);
  pgm.sql(`DELETE FROM users;`);
  pgm.sql(`DELETE FROM categories;`);
  pgm.sql(`DELETE FROM authors;`);
};
