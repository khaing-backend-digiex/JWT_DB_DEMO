import { ValidationSchema } from "../middleware/validate.middleware";

export const CreateBookSchema: ValidationSchema = {
    title: { type: "string", isRequired: true },
    authorId: { type: "number", isRequired: true },
    publishedDate: { type: "string", isRequired: true },
    categoryId: { isArray: true, isRequired: true }
};

export const UpdateBookSchema: ValidationSchema = {
    name: { type: "string", isRequired: false, name: "Title" },
    authorId: { type: "string", isRequired: false, name: "Author ID" },
    publishedDate: { type: "string", isRequired: false, name: "Published Date" },
    categoryIds: { isArray: true, isRequired: false, name: "Categories" },
    content: { type: "string", isRequired: false, name: "Content" }
};

export const CreateUserSchema: ValidationSchema = {
    username: { type: "string", isRequired: true, name: "Username" },
    password: { type: "string", isRequired: true, name: "Password" }
};

export const CreateAuthorSchema: ValidationSchema = {
    name: { type: "string", isRequired: true, name: "Author Name" }
};

export const CreateCategorySchema: ValidationSchema = {
    name: { type: "string", isRequired: true, name: "Category Name" }
};
