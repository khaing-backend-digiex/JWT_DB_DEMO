export interface CreateBookRequest {
    name: string;
    authorId: string;
    categoryIds: string[];
    content: string;
    publishedDate: string;
}

export interface UpdateBookRequest {
    name?: string;
    authorId?: string;
    categoryIds?: string[];
    content?: string;
    publishedDate?: string;
}

export interface BookQueryRequest {
    id?: string;
    name?: string;
    authorId?: string;
    categoryId?: string;
    page?: number;
    offset?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
