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
  pgm.createTable('books', {
    id: { type: 'uuid', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    author_id: { type: 'uuid', notNull: true },
    category_ids: { type: 'text[]', notNull: true, default: '{}' },
    content: { type: 'text', notNull: true },
    published_date: { type: 'date', notNull: true },
    created_date: { type: 'date', notNull: true, default: pgm.func('CURRENT_DATE') },
  });

  pgm.createIndex('books', 'author_id');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('books');
};
