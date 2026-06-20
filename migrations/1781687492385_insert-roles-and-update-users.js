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
    // 1. Insert Roles
    pgm.sql(`
        INSERT INTO role_table (name, description) VALUES
        ('admin', 'Administrator with full access'),
        ('user', 'Regular user with limited access')
        ON CONFLICT (name) DO NOTHING;
    `);

    // 2. Insert Permissions
    pgm.sql(`
        INSERT INTO permission_table (name, description) VALUES
        ('read_book', 'Read books'),
        ('create_book', 'Create new books'),
        ('update_book', 'Update existing books'),
        ('delete_book', 'Delete books'),
        ('manage_users', 'Manage user accounts')
        ON CONFLICT (name) DO NOTHING;
    `);

    // 3. Map Roles to Permissions (role_permissions)
    pgm.sql(`
        INSERT INTO role_permissions (role_name, permission_name) VALUES
        -- Admin gets all permissions
        ('admin', 'read_book'), ('admin', 'create_book'), ('admin', 'update_book'), ('admin', 'delete_book'), ('admin', 'manage_users'),
        -- User gets only read_book
        ('user', 'read_book')
        ON CONFLICT (role_name, permission_name) DO NOTHING;
    `);

    // 4. Assign Roles to Users
    pgm.sql(`
        INSERT INTO user_roles (user_id, role_name) VALUES
        ((SELECT id FROM users WHERE username = 'admin'), 'admin'),
        ((SELECT id FROM users WHERE username = 'nguyenvana'), 'user'),
        ((SELECT id FROM users WHERE username = 'tranthib'), 'user'),
        ((SELECT id FROM users WHERE username = 'newuser123'), 'user'),
        ((SELECT id FROM users WHERE username = 'testuser'), 'user')
        ON CONFLICT (user_id, role_name) DO NOTHING;
    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.sql(`DELETE FROM user_roles;`);
    pgm.sql(`DELETE FROM role_permissions;`);
    pgm.sql(`DELETE FROM permission_table;`);
    pgm.sql(`DELETE FROM role_table;`);
};
