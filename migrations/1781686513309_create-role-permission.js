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
    // 1. Tạo bảng role_table, name làm primary key
    pgm.createTable('role_table', {
        name: { type: 'varchar(50)', primaryKey: true },
        description: { type: 'varchar(255)' },
    });

    // 2. Tạo bảng permission_table, name làm primary key
    pgm.createTable('permission_table', {
        name: { type: 'varchar(50)', primaryKey: true },
        description: { type: 'varchar(255)' },
    });

    // 3. Tạo bảng liên kết role_permissions
    pgm.createTable('role_permissions', {
        role_name: {
            type: 'varchar(50)',
            notNull: true,
            references: '"role_table"',
            onDelete: 'CASCADE'
        },
        permission_name: {
            type: 'varchar(50)',
            notNull: true,
            references: '"permission_table"',
            onDelete: 'CASCADE'
        }
    });

    pgm.addConstraint('role_permissions', 'pk_role_permissions', {
        primaryKey: ['role_name', 'permission_name']
    });

    // 4. Bảng liên kết user_roles (Nhiều - Nhiều)
    pgm.createTable('user_roles', {
        user_id: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE'
        },
        role_name: {
            type: 'varchar(50)',
            notNull: true,
            references: '"role_table"',
            onDelete: 'CASCADE'
        }
    });

    pgm.addConstraint('user_roles', 'pk_user_roles', {
        primaryKey: ['user_id', 'role_name']
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('user_roles');
    pgm.dropTable('role_permissions');
    pgm.dropTable('permission_table');
    pgm.dropTable('role_table');
};
