export interface User  {
    id: number;
    username: string;
    password: string;
    name: string;
    email: string;
    dataOfBirth: Date;
    roles?: string[];
}
