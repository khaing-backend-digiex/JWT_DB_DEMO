
export const PAGINATION_DEFAULTS = {
    PAGE: 1,
    LIMIT: 10,
    MIN_PAGE: 1,
    MIN_LIMIT: 1,
    MAX_LIMIT: 100,
} as const;

export const SORT_FIELDS = {
    CREATED_DATE: "createdDate",
    PUBLISHED_DATE: "publishedDate",
} as const;

export const SORT_ORDER = {
    ASC: "asc",
    DESC: "desc",
} as const;


export const SERVER_CONFIG = {
    PORT: 3000,
} as const;

export const DATE_FORMAT_REGEX = /^\d{4}-\d{2}-\d{2}$/;