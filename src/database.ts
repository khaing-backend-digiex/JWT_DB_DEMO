import pgPromise from 'pg-promise';
import * as dotenv from 'dotenv';


import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });


function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

const pgp = pgPromise({
    receive(e) {
        for (const row of e.data) {
            for (const key of Object.keys(row)) {
                const camelKey = toCamelCase(key);
                if (camelKey !== key) {
                    row[camelKey] = row[key];
                    delete row[key];
                }
            }
        }
    }
});

if (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER || process.env.DB_PASSWORD === undefined) {
    console.error('❌ Lỗi: Thiếu các biến môi trường Database (DB_HOST, DB_NAME, DB_USER, DB_PASSWORD) trong file .env!');
    process.exit(1);
}

const db = pgp({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

export const testDbConnection = async () => {
    try {
        await db.query('SELECT 1');
        console.log('✅ Kết nối Database PostgreSQL thành công!');
    } catch (error) {
        console.error('❌ Lỗi kết nối Database!', error);
        process.exit(1);
    }
};
export default db;
