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

            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                username VARCHAR(100) NOT NULL UNIQUE,
                role VARCHAR(50) NOT NULL DEFAULT 'receptionist',
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';

            DROP TRIGGER IF EXISTS update_users_updated_at ON users;
            CREATE TRIGGER update_users_updated_at
                BEFORE UPDATE ON users
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();

            -- enforce allowed roles (simple check constraint)
            ALTER TABLE users
            ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'receptionist'));
        `);

        console.log('Users migration up completed');
    } catch (error) {
        console.error('Users migration up failed', error);
        throw error;
    }
}

export async function down(): Promise<void> {
    try {
        await pool.query(`
            DROP TRIGGER IF EXISTS update_users_updated_at ON users;
            DROP FUNCTION IF EXISTS update_updated_at_column();
            DROP TABLE IF EXISTS users;
        `);
        console.log('Users migration down completed');
    } catch (error) {
        console.error('Users migration down failed', error);
        throw error;
    }
}
