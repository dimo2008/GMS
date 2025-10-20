import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'gms_db'
});

export async function up(): Promise<void> {
    try {
        await pool.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

            -- create roles table
            CREATE TABLE IF NOT EXISTS roles (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(100) NOT NULL UNIQUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            -- ensure base roles exist
            INSERT INTO roles (name) VALUES ('admin') ON CONFLICT (name) DO NOTHING;
            INSERT INTO roles (name) VALUES ('receptionist') ON CONFLICT (name) DO NOTHING;

            -- add new role_id column to users
            ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id UUID;

            -- map existing string role -> role_id when possible
            UPDATE users u
            SET role_id = r.id
            FROM roles r
            WHERE u.role IS NOT NULL AND r.name = u.role;

            -- for any users without role_id, set to receptionist
            UPDATE users u
            SET role_id = r.id
            FROM roles r
            WHERE u.role_id IS NULL AND r.name = 'receptionist';

            -- make role_id NOT NULL and add FK constraint
            ALTER TABLE users ALTER COLUMN role_id SET NOT NULL;
            ALTER TABLE users ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT;

            -- drop old role column if it exists
            ALTER TABLE users DROP COLUMN IF EXISTS role;
        `);

        console.log('CreateRolesAndLinkToUsers migration up completed');
    } catch (error) {
        console.error('CreateRolesAndLinkToUsers migration up failed', error);
        throw error;
    }
}

export async function down(): Promise<void> {
    try {
        await pool.query(`
            -- add back role (string) column
            ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50);

            -- attempt to populate role string from role_id
            UPDATE users u
            SET role = r.name
            FROM roles r
            WHERE u.role_id = r.id;

            -- drop fk and role_id column
            ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_role;
            ALTER TABLE users DROP COLUMN IF EXISTS role_id;

            -- drop roles table
            DROP TABLE IF EXISTS roles;
        `);

        console.log('CreateRolesAndLinkToUsers migration down completed');
    } catch (error) {
        console.error('CreateRolesAndLinkToUsers migration down failed', error);
        throw error;
    }
}
