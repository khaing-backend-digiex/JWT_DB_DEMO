export interface CreateUserRequest {
    username: string;
    password: string;
    name: string;
    email: string;
    dataOfBirth: string;
    roles?: string[];
}

export interface UpdateUserRequest {
    username?: string;
    password?: string;
    name?: string;
    email?: string;
    dataOfBirth?: string;
    roles?: string[];   
}
