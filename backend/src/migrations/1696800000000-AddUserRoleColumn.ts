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
        // Add role column if it doesn't exist, set default, and add check constraint
        await pool.query(`
            ALTER TABLE IF EXISTS users
            ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'receptionist' NOT NULL;

            -- add constraint if not exists (check existence via pg_constraint catalog)
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'users_role_check'
                ) THEN
                    ALTER TABLE users
                    ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'receptionist'));
                END IF;
            END$$;
        `);

        console.log('AddUserRoleColumn migration up completed');
    } catch (error) {
        console.error('AddUserRoleColumn migration up failed', error);
        throw error;
    }
}

export async function down(): Promise<void> {
    try {
        await pool.query(`
            ALTER TABLE IF EXISTS users
            DROP CONSTRAINT IF EXISTS users_role_check;
            ALTER TABLE IF EXISTS users
            DROP COLUMN IF EXISTS role;
        `);
        console.log('AddUserRoleColumn migration down completed');
    } catch (error) {
        console.error('AddUserRoleColumn migration down failed', error);
        throw error;
    }
}
