export interface UserResponse {
    id: string;
    username: string;
    name: string;
    email: string;
    dataOfBirth: string;
    roles?: string[];
}
