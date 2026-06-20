export interface User {
    id: number;
    username: string;
    password: string;
    name: string;
    email: string;
    dataOfBirth: Date;
    createdAt?: Date;
    updatedAt?: Date;
    roles?: string[];   
}