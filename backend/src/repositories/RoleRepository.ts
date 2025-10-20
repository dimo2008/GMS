import { Pool } from 'pg';
import { Role } from '../models/Role';

export class RoleRepository {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'gms_db'
        });
    }

    async create(role: Partial<Role>): Promise<Role> {
        const result = await this.pool.query(
            `INSERT INTO roles (name) VALUES ($1) RETURNING *`,
            [role.name]
        );
        return this.mapRow(result.rows[0]);
    }

    async findByName(name: string): Promise<Role | null> {
        const result = await this.pool.query(`SELECT * FROM roles WHERE name = $1`, [name]);
        return result.rows.length ? this.mapRow(result.rows[0]) : null;
    }

    async findById(id: string): Promise<Role | null> {
        const result = await this.pool.query(`SELECT * FROM roles WHERE id = $1`, [id]);
        return result.rows.length ? this.mapRow(result.rows[0]) : null;
    }

    async findAll(): Promise<Role[]> {
        const result = await this.pool.query(`SELECT * FROM roles`);
        return result.rows.map(r => this.mapRow(r));
    }

    private mapRow(row: any): Role {
        const r = new Role();
        r.id = row.id;
        r.name = row.name;
        r.createdAt = row.created_at;
        r.updatedAt = row.updated_at;
        return r;
    }
}
