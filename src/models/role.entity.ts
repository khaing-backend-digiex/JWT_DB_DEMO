import { Permission } from "./permission.entity";

export interface Role {
    name: string;
    description?: string;
    permissions?: Permission[];
}
