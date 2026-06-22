import db from '../database';

export let RolePermissionsCache: Record<string, string[]> = {};

export const loadPermissionsToRAM = async () => {
    try {
        const query = `
            SELECT role_name, permission_name AS permission_code
            FROM role_permissions
        `;
        
        const rows = await db.any(query);
        const newCache: Record<string, string[]> = {};
        
        rows.forEach((row: any) => {
            if (!newCache[row.role_name]) {
                newCache[row.role_name] = [];
            }
            newCache[row.role_name]!.push(row.permission_code);
        });

        RolePermissionsCache = newCache;
        console.log("✅ Load Permission Cache từ DB lên RAM thành công!");
    } catch (error) {
        console.error("❌ Lỗi khi load Permission Cache:", error);
    }
};
