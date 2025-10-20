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

            CREATE TABLE IF NOT EXISTS roles (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                name VARCHAR(100) NOT NULL UNIQUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            INSERT INTO roles (name) VALUES ('admin') ON CONFLICT (name) DO NOTHING;
            INSERT INTO roles (name) VALUES ('receptionist') ON CONFLICT (name) DO NOTHING;
        `);
        console.log('CreateRolesTable migration up completed');
    } catch (error) {
        console.error('CreateRolesTable migration up failed', error);
        throw error;
    }
}

export async function down(): Promise<void> {
    try {
        await pool.query(`
            DROP TABLE IF EXISTS roles;
        `);
        console.log('CreateRolesTable migration down completed');
    } catch (error) {
        console.error('CreateRolesTable migration down failed', error);
        throw error;
    }
}
