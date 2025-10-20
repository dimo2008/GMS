import { Role } from "../models/Role";
import { RoleRepository } from "../repositories/RoleRepository";

export class RoleService {
    private repo: RoleRepository;

    constructor() {
        this.repo = new RoleRepository();
    }

    async createRole(data: Partial<Role>): Promise<Role> {
        if (!data.name) throw new Error('Role name is required');
        const existing = await this.repo.findByName(data.name);
        if (existing) throw new Error('Role already exists');
        return await this.repo.create(data);
    }

    async getAllRoles(): Promise<Role[]> {
        return await this.repo.findAll();
    }

    async getRoleById(id: string): Promise<Role | null> {
        if (!id) throw new Error('Role id is required');
        return await this.repo.findById(id);
    }

    async updateRole(id: string, data: Partial<Role>): Promise<Role | null> {
        if (!id) throw new Error('Role id is required');
        const existing = await this.repo.findById(id);
        if (!existing) throw new Error('Role not found');
        // only name updatable for now
        if (data.name) {
            const other = await this.repo.findByName(data.name);
            if (other && other.id !== id) throw new Error('Role name already in use');
        }
        // repository doesn't have update; implement quick update here
        const pool = (this.repo as any).pool;
        const result = await pool.query(`UPDATE roles SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`, [data.name || existing.name, id]);
        return result.rows.length ? this.repo['mapRow'](result.rows[0]) : null;
    }

    async deleteRole(id: string): Promise<void> {
        if (!id) throw new Error('Role id is required');
        // simple delete
        const pool = (this.repo as any).pool;
        await pool.query('DELETE FROM roles WHERE id = $1', [id]);
    }
}
