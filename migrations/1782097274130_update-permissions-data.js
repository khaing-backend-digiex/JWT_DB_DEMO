/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.sql(`
        -- Insert permissions
        INSERT INTO permission_table (name, description) VALUES
            ('CREATE_USER', 'Create User'),
            ('VIEW_USER', 'View User'),
            ('UPDATE_USER', 'Update User'),
            ('DELETE_USER', 'Delete User'),
            ('UPDATE_OWN_PROFILE', 'Update Own Profile'),
            ('CREATE_POST', 'Create Post'),
            ('DELETE_POST', 'Delete Post'),
            ('CREATE_BOOK', 'Create Book'),
            ('VIEW_BOOK', 'View Book'),
            ('UPDATE_BOOK', 'Update Book'),
            ('DELETE_BOOK', 'Delete Book'),
            ('CREATE_AUTHOR', 'Create Author'),
            ('VIEW_AUTHOR', 'View Author'),
            ('UPDATE_AUTHOR', 'Update Author'),
            ('DELETE_AUTHOR', 'Delete Author'),
            ('CREATE_CATEGORY', 'Create Category'),
            ('VIEW_CATEGORY', 'View Category'),
            ('UPDATE_CATEGORY', 'Update Category'),
            ('DELETE_CATEGORY', 'Delete Category')
        ON CONFLICT (name) DO NOTHING;

        -- Map for admin
        INSERT INTO role_permissions (role_name, permission_name) VALUES
            ('admin', 'CREATE_USER'), ('admin', 'VIEW_USER'), ('admin', 'UPDATE_USER'), ('admin', 'DELETE_USER'),
            ('admin', 'UPDATE_OWN_PROFILE'), ('admin', 'CREATE_POST'), ('admin', 'DELETE_POST'),
            ('admin', 'CREATE_BOOK'), ('admin', 'VIEW_BOOK'), ('admin', 'UPDATE_BOOK'), ('admin', 'DELETE_BOOK'),
            ('admin', 'CREATE_AUTHOR'), ('admin', 'VIEW_AUTHOR'), ('admin', 'UPDATE_AUTHOR'), ('admin', 'DELETE_AUTHOR'),
            ('admin', 'CREATE_CATEGORY'), ('admin', 'VIEW_CATEGORY'), ('admin', 'UPDATE_CATEGORY'), ('admin', 'DELETE_CATEGORY')
        ON CONFLICT DO NOTHING;

        -- Map for manager
        INSERT INTO role_permissions (role_name, permission_name) VALUES
            ('manager', 'CREATE_USER'), ('manager', 'VIEW_USER'), ('manager', 'UPDATE_USER'), ('manager', 'DELETE_USER'),
            ('manager', 'UPDATE_OWN_PROFILE'), ('manager', 'CREATE_POST'), ('manager', 'DELETE_POST'),
            ('manager', 'CREATE_BOOK'), ('manager', 'VIEW_BOOK'), ('manager', 'UPDATE_BOOK'), ('manager', 'DELETE_BOOK'),
            ('manager', 'CREATE_AUTHOR'), ('manager', 'VIEW_AUTHOR'), ('manager', 'UPDATE_AUTHOR'), ('manager', 'DELETE_AUTHOR'),
            ('manager', 'CREATE_CATEGORY'), ('manager', 'VIEW_CATEGORY'), ('manager', 'UPDATE_CATEGORY'), ('manager', 'DELETE_CATEGORY')
        ON CONFLICT DO NOTHING;

        -- Map for user
        INSERT INTO role_permissions (role_name, permission_name) VALUES
            ('user', 'VIEW_USER'), ('user', 'UPDATE_OWN_PROFILE'), ('user', 'VIEW_BOOK'), ('user', 'VIEW_AUTHOR'), ('user', 'VIEW_CATEGORY')
        ON CONFLICT DO NOTHING;
    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
