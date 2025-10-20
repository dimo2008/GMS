import { Pool } from 'pg';
import { User } from '../models/User';

export class UserRepository {
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

    async create(user: Partial<User>): Promise<User> {
        const query = `
            INSERT INTO users (
                first_name,
                last_name,
                email,
                username,
                role_id,
                password_hash
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;

        const values = [
            user.firstName,
            user.lastName,
            user.email,
            user.username,
            // roleId may be provided in the user object
            user.roleId || null,
            user.passwordHash
        ];

        const result = await this.pool.query(query, values);
        return this.mapRowToUser(result.rows[0]);
    }

    async findAll(): Promise<User[]> {
        const result = await this.pool.query('SELECT * FROM users');
        return result.rows.map(r => this.mapRowToUser(r));
    }

    async findById(id: string): Promise<User | null> {
        const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows.length ? this.mapRowToUser(result.rows[0]) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows.length ? this.mapRowToUser(result.rows[0]) : null;
    }

    async findByUsername(username: string): Promise<User | null> {
        const result = await this.pool.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows.length ? this.mapRowToUser(result.rows[0]) : null;
    }

    async update(id: string, user: Partial<User>): Promise<User | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramCount = 1;

        if (user.firstName) { fields.push(`first_name = $${paramCount++}`); values.push(user.firstName); }
        if (user.lastName) { fields.push(`last_name = $${paramCount++}`); values.push(user.lastName); }
        if (user.email) { fields.push(`email = $${paramCount++}`); values.push(user.email); }
        if (user.username) { fields.push(`username = $${paramCount++}`); values.push(user.username); }
    if (user.roleId) { fields.push(`role_id = $${paramCount++}`); values.push(user.roleId); }
        if (user.passwordHash) { fields.push(`password_hash = $${paramCount++}`); values.push(user.passwordHash); }

        if (fields.length === 0) return null;

        values.push(id);
        const query = `
            UPDATE users
            SET ${fields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *`;

        const result = await this.pool.query(query, values);
        return result.rows.length ? this.mapRowToUser(result.rows[0]) : null;
    }

    async delete(id: string): Promise<void> {
        await this.pool.query('DELETE FROM users WHERE id = $1', [id]);
    }

    private mapRowToUser(row: any): User {
        const u = new User();
        u.id = row.id;
        u.firstName = row.first_name;
        u.lastName = row.last_name;
        u.email = row.email;
        u.username = row.username;
    u.roleId = row.role_id;
        u.passwordHash = row.password_hash;
        u.createdAt = row.created_at;
        u.updatedAt = row.updated_at;
        return u;
    }
}
