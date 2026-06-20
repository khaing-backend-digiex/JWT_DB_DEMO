import type { User } from '../models/user.entity';
import db from '../database';

export class UserRepository {
    async findAll(): Promise<User[]> {
        const users = await db.any<User>('SELECT * FROM users');
        return users;
    }
    async findByUserName(username: string): Promise<User | null> {
        return db.oneOrNone<User>(
            `
            SELECT u.*, 
                   COALESCE(array_agg(ur.role_name) FILTER (WHERE ur.role_name IS NOT NULL), '{}') as roles
            FROM users u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            WHERE u.username = $1
            GROUP BY u.id
            `,
            [username]
        );
    }
    async create(user: Omit<User, 'id'>): Promise<User> {
        const createdUser = await db.one<User>(
            `
            INSERT INTO users (username, password, name, email, "dataOfBirth") 
            VALUES ($1, $2, $3, $4, $5) RETURNING *
            `,
            [user.username, user.password, user.name, user.email, user.dataOfBirth]
        );
        return createdUser;
    }
    async update(user: User): Promise<User> {
        const updatedUser = await db.one<User>(
            `
            UPDATE users     
            SET username = $1, password = $2, name = $3, email = $4 
            WHERE id = $5 RETURNING *
            `,
            [user.username, user.password, user.name, user.email, user.id]
        );
        return updatedUser;
    }

    async assignRolesToUser(userId: number, roles: string[]): Promise<void> {
        if (roles.length === 0) return;
        const queries = roles.map(role => 
            db.none('INSERT INTO user_roles (user_id, role_name) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, role])
        );
        await Promise.all(queries);
    }

    async removeRolesFromUser(userId: number): Promise<void> {
        await db.none('DELETE FROM user_roles WHERE user_id = $1', [userId]);
    }
    async delete(id: number): Promise<User> {
        const deletedUser = await db.one<User>(`
            DELETE 
            FROM users 
            WHERE id = $1 
            RETURNING *
            `,
            id);
        return deletedUser;
    }
    async findById(id: number): Promise<User | null> {
        const user = await db.oneOrNone<User>(
            `     
            SELECT *
            FROM users
            WHERE id = $1   
            `,
            id
        );
        return user;
    }
}