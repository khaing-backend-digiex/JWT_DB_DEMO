import { DATE_FORMAT_REGEX } from "../constant/constant";

export class ValidationError extends Error {
    public issues: { message: string; path?: string[] }[];
    constructor(issues: { message: string; path?: string[] }[]) {
        super("Validation failed");
        this.name = "ValidationError";
        this.issues = issues;
    }
}

export const validateCreateBook = (data: Record<string, any>) => {
    const issues: { message: string; path?: string[] }[] = [];

    if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
        issues.push({ message: "Name is required", path: ["name"] });
    }
    if (!data.authorId || typeof data.authorId !== "string" || data.authorId.trim().length === 0) {
    }
    if (!Array.isArray(data.categoryIds) || data.categoryIds.length === 0 || !data.categoryIds.every((c: any) => typeof c === "string" && c.trim().length > 0)) {
        issues.push({ message: "Category IDs array must not be empty", path: ["categoryIds"] });
    }
    if (!data.content || typeof data.content !== "string" || data.content.trim().length === 0) {
        issues.push({ message: "Content is required", path: ["content"] });
    }
    if (!data.publishedDate || typeof data.publishedDate !== "string" || !DATE_FORMAT_REGEX.test(data.publishedDate)) {
        issues.push({ message: "Published date must be a valid date in YYYY-MM-DD format", path: ["publishedDate"] });
    }

    const allowedKeys = ["name", "authorId", "categoryIds", "content", "publishedDate"];
    const extraKeys = Object.keys(data).filter(key => !allowedKeys.includes(key));
    if (extraKeys.length > 0) {
        issues.push({ message: `Unrecognized keys in payload: ${extraKeys.join(", ")}` });
    }

    if (issues.length > 0) {
        throw new ValidationError(issues);
    }

    return {
        name: data.name,
        authorId: data.authorId,
        categoryIds: data.categoryIds,
        content: data.content,
        publishedDate: data.publishedDate,
    };
};

export const validateUpdateBook = (data: Record<string, any>) => {
    const issues: { message: string; path?: string[] }[] = [];

    if (data.name !== undefined && (typeof data.name !== "string" || data.name.trim().length === 0)) {
        issues.push({ message: "Name is required", path: ["name"] });
    }
    if (data.authorId !== undefined && (typeof data.authorId !== "string" || data.authorId.trim().length === 0)) {
        issues.push({ message: "Author ID is required", path: ["authorId"] });
    }
    if (data.categoryIds !== undefined && (!Array.isArray(data.categoryIds) || data.categoryIds.length === 0 || !data.categoryIds.every((c: any) => typeof c === "string" && c.trim().length > 0))) {
        issues.push({ message: "Category IDs array must not be empty", path: ["categoryIds"] });
    }
    if (data.content !== undefined && (typeof data.content !== "string" || data.content.trim().length === 0)) {
        issues.push({ message: "Content is required", path: ["content"] });
    }
    if (data.publishedDate !== undefined && (typeof data.publishedDate !== "string" || !DATE_FORMAT_REGEX.test(data.publishedDate))) {
        issues.push({ message: "Published date must be a valid date in YYYY-MM-DD format", path: ["publishedDate"] });
    }

    const allowedKeys = ["name", "authorId", "categoryIds", "content", "publishedDate"];
    const extraKeys = Object.keys(data).filter(key => !allowedKeys.includes(key));
    if (extraKeys.length > 0) {
        issues.push({ message: `Unrecognized keys in payload: ${extraKeys.join(", ")}` });
    }

    if (issues.length > 0) {
        throw new ValidationError(issues);
    }

    const result: any = {};
    if (data.name !== undefined) result.name = data.name;
    if (data.authorId !== undefined) result.authorId = data.authorId;
    if (data.categoryIds !== undefined) result.categoryIds = data.categoryIds;
    if (data.content !== undefined) result.content = data.content;
    if (data.publishedDate !== undefined) result.publishedDate = data.publishedDate;

    return result;
};

export const validateBookQuery = (data: Record<string, any>) => {
    const issues: { message: string; path?: string[] }[] = [];
    const result: any = {};

    if (data.id !== undefined) result.id = String(data.id);
    if (data.name !== undefined) result.name = String(data.name);
    if (data.authorId !== undefined) result.authorId = String(data.authorId);
    if (data.categoryId !== undefined) result.categoryId = String(data.categoryId);

    if (data.page !== undefined) {
        const page = Number(data.page);
        if (isNaN(page) || !Number.isInteger(page) || page < 1) {
            issues.push({ message: "Page must be an integer >= 1", path: ["page"] });
        } else {
            result.page = page;
        }
    }

    if (data.offset !== undefined) {
        const offset = Number(data.offset);
        if (isNaN(offset) || !Number.isInteger(offset) || offset < 0) {
            issues.push({ message: "Offset must be an integer >= 0", path: ["offset"] });
        } else {
            result.offset = offset;
        }
    }

    if (data.limit !== undefined) {
        const limit = Number(data.limit);
        if (isNaN(limit) || !Number.isInteger(limit) || limit < 1 || limit > 100) {
            issues.push({ message: "Limit must be an integer between 1 and 100", path: ["limit"] });
        } else {
            result.limit = limit;
        }
    }

    if (data.sortBy !== undefined) {
        if (data.sortBy !== "createdDate" && data.sortBy !== "publishedDate") {
            issues.push({ message: "Invalid sort field. Expected 'createdDate' or 'publishedDate'", path: ["sortBy"] });
        } else {
            result.sortBy = data.sortBy;
        }
    }

    if (data.sortOrder !== undefined) {
        if (data.sortOrder !== "asc" && data.sortOrder !== "desc") {
            issues.push({ message: "Invalid sort order. Expected 'asc' or 'desc'", path: ["sortOrder"] });
        } else {
            result.sortOrder = data.sortOrder;
        }
    }

    const allowedKeys = ["id", "name", "authorId", "categoryId", "page", "offset", "limit", "sortBy", "sortOrder"];
    const extraKeys = Object.keys(data).filter(key => !allowedKeys.includes(key));
    if (extraKeys.length > 0) {
        issues.push({ message: `Unrecognized query parameters: ${extraKeys.join(", ")}` });
    }

    if (issues.length > 0) {
        throw new ValidationError(issues);
    }

    return result;
};

export const validateCreateAuthor = (data: Record<string, any>) => {
    const issues: { message: string; path?: string[] }[] = [];
    if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
        issues.push({ message: "Name is required", path: ["name"] });
    }
    if (issues.length > 0) throw new ValidationError(issues);
    return { name: data.name };
};

export const validateCreateCategory = (data: Record<string, any>) => {
    const issues: { message: string; path?: string[] }[] = [];
    if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
        issues.push({ message: "Name is required", path: ["name"] });
    }
    if (issues.length > 0) throw new ValidationError(issues);
    return { name: data.name };
};
