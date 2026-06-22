import { Role } from "./role.enum";

export enum AppPermission {
   
    CREATE_USER = 'CREATE_USER',
    VIEW_USER = 'VIEW_USER',
    UPDATE_USER = 'UPDATE_USER',
    DELETE_USER = 'DELETE_USER',


    UPDATE_OWN_PROFILE = 'UPDATE_OWN_PROFILE',

    CREATE_POST = 'CREATE_POST',
    DELETE_POST = 'DELETE_POST',

    CREATE_BOOK = 'CREATE_BOOK',
    VIEW_BOOK = 'VIEW_BOOK',
    UPDATE_BOOK = 'UPDATE_BOOK',
    DELETE_BOOK = 'DELETE_BOOK',

    CREATE_AUTHOR = 'CREATE_AUTHOR',
    VIEW_AUTHOR = 'VIEW_AUTHOR',
    UPDATE_AUTHOR = 'UPDATE_AUTHOR',
    DELETE_AUTHOR = 'DELETE_AUTHOR',

    CREATE_CATEGORY = 'CREATE_CATEGORY',
    VIEW_CATEGORY = 'VIEW_CATEGORY',
    UPDATE_CATEGORY = 'UPDATE_CATEGORY',
    DELETE_CATEGORY = 'DELETE_CATEGORY',
}

export const RolePermissions = {
    [Role.admin]: [
        AppPermission.CREATE_USER, AppPermission.VIEW_USER, AppPermission.UPDATE_USER, AppPermission.DELETE_USER,
        AppPermission.UPDATE_OWN_PROFILE,
        AppPermission.CREATE_POST, AppPermission.DELETE_POST,
        AppPermission.CREATE_BOOK, AppPermission.VIEW_BOOK, AppPermission.UPDATE_BOOK, AppPermission.DELETE_BOOK,
        AppPermission.CREATE_AUTHOR, AppPermission.VIEW_AUTHOR, AppPermission.UPDATE_AUTHOR, AppPermission.DELETE_AUTHOR,
        AppPermission.CREATE_CATEGORY, AppPermission.VIEW_CATEGORY, AppPermission.UPDATE_CATEGORY, AppPermission.DELETE_CATEGORY,
    ],
    [Role.manager]: [
        AppPermission.CREATE_USER, AppPermission.VIEW_USER, AppPermission.UPDATE_USER, AppPermission.DELETE_USER,
        AppPermission.UPDATE_OWN_PROFILE,
        AppPermission.CREATE_POST, AppPermission.DELETE_POST,
        AppPermission.CREATE_BOOK, AppPermission.VIEW_BOOK, AppPermission.UPDATE_BOOK, AppPermission.DELETE_BOOK,
        AppPermission.CREATE_AUTHOR, AppPermission.VIEW_AUTHOR, AppPermission.UPDATE_AUTHOR, AppPermission.DELETE_AUTHOR,
        AppPermission.CREATE_CATEGORY, AppPermission.VIEW_CATEGORY, AppPermission.UPDATE_CATEGORY, AppPermission.DELETE_CATEGORY,
    ],
    [Role.user]: [
        AppPermission.VIEW_USER,
        AppPermission.UPDATE_OWN_PROFILE,
        AppPermission.VIEW_BOOK,
        AppPermission.VIEW_AUTHOR,
        AppPermission.VIEW_CATEGORY,
    ]
};
