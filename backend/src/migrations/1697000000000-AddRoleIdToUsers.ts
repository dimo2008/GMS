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
            -- add new role_id column to users
            ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id UUID;


            -- If the 'role' column exists, migrate data from it. Otherwise, just set all users to receptionist.
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role'
                ) THEN
                    -- map existing string role -> role_id when possible
                    UPDATE users u
                    SET role_id = r.id
                    FROM roles r
                    WHERE u.role IS NOT NULL AND r.name = u.role;
                END IF;
            END$$;

            -- for any users without role_id, set to receptionist
            UPDATE users u
            SET role_id = r.id
            FROM roles r
            WHERE u.role_id IS NULL AND r.name = 'receptionist';


            -- make role_id NOT NULL
            ALTER TABLE users ALTER COLUMN role_id SET NOT NULL;

            -- add FK constraint only if it does not exist
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_role'
                ) THEN
                    ALTER TABLE users ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT;
                END IF;
            END$$;

            -- drop old role column if it exists
            ALTER TABLE users DROP COLUMN IF EXISTS role;
        `);
        console.log('AddRoleIdToUsers migration up completed');
    } catch (error) {
        console.error('AddRoleIdToUsers migration up failed', error);
        throw error;
    }
}

export async function down(): Promise<void> {
    try {
        await pool.query(`
            ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50);
            UPDATE users u
            SET role = r.name
            FROM roles r
            WHERE u.role_id = r.id;
            ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_role;
            ALTER TABLE users DROP COLUMN IF EXISTS role_id;
        `);
        console.log('AddRoleIdToUsers migration down completed');
    } catch (error) {
        console.error('AddRoleIdToUsers migration down failed', error);
        throw error;
    }
}
