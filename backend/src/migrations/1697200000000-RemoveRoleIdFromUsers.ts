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
            -- drop foreign key constraint if it exists
            ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_role;

            -- drop role_id column if it exists
            ALTER TABLE users DROP COLUMN IF EXISTS role_id;
        `);

        console.log('RemoveRoleIdFromUsers migration up completed');
    } catch (error) {
        console.error('RemoveRoleIdFromUsers migration up failed', error);
        throw error;
    }
}

export async function down(): Promise<void> {
    try {
        await pool.query(`
            -- re-add role_id column
            ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id UUID;

            -- if roles table exists, attempt to repopulate role_id from any existing role (string) column
            DO $$
            BEGIN
                IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'roles') THEN
                    -- if a string 'role' column exists, try to map it back
                    IF EXISTS (
                        SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='role'
                    ) THEN
                        UPDATE users u
                        SET role_id = r.id
                        FROM roles r
                        WHERE u.role IS NOT NULL AND r.name = u.role;
                    END IF;

                    -- set any remaining nulls to receptionist
                    UPDATE users u
                    SET role_id = r.id
                    FROM roles r
                    WHERE u.role_id IS NULL AND r.name = 'receptionist';
                END IF;
            END$$;

                    -- make role_id NOT NULL and add FK constraint only if roles table exists
                    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'roles') THEN
                        -- make role_id NOT NULL
                        EXECUTE 'ALTER TABLE users ALTER COLUMN role_id SET NOT NULL';

                        -- add FK constraint only if it does not exist
                        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_users_role') THEN
                            EXECUTE 'ALTER TABLE users ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT';
                        END IF;
                    END IF;
        `);

        console.log('RemoveRoleIdFromUsers migration down completed');
    } catch (error) {
        console.error('RemoveRoleIdFromUsers migration down failed', error);
        throw error;
    }
}
