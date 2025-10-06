import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ 
    path: path.join(__dirname, '../../.env'),
    debug: process.env.DEBUG === 'true'
});

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'gms_db'
});

export async function up(): Promise<void> {
    try {
        // Create custom types for membership and status
        await pool.query(`
            DO $$ 
            BEGIN
                -- Create membership_type enum if it doesn't exist
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'membership_type_enum') THEN
                    CREATE TYPE membership_type_enum AS ENUM ('STANDARD', 'PREMIUM', 'VIP');
                END IF;

                -- Create status enum if it doesn't exist
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'member_status_enum') THEN
                    CREATE TYPE member_status_enum AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
                END IF;
            END $$;
        `);

        // Create the members table
        await pool.query(`
            -- Enable UUID extension if not already enabled
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

            -- Create members table
            CREATE TABLE IF NOT EXISTS members (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(20) NOT NULL,
                membership_type membership_type_enum NOT NULL DEFAULT 'STANDARD',
                start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                end_date TIMESTAMP WITH TIME ZONE NOT NULL,
                status member_status_enum NOT NULL DEFAULT 'ACTIVE',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'),
                CONSTRAINT phone_format CHECK (phone ~* '^\\+?[0-9]{10,15}$'),
                CONSTRAINT valid_dates CHECK (end_date > start_date)
            );

            -- Create indexes
            CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
            CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
            CREATE INDEX IF NOT EXISTS idx_members_membership_type ON members(membership_type);
            CREATE INDEX IF NOT EXISTS idx_members_end_date ON members(end_date);

            -- Create function for updating timestamps
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';

            -- Create trigger for automatic timestamp updates
            DROP TRIGGER IF EXISTS update_members_updated_at ON members;
            CREATE TRIGGER update_members_updated_at
                BEFORE UPDATE ON members
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        `);

        console.log('Migration up completed successfully');
    } catch (error) {
        console.error('Migration up failed:', error);
        throw error;
    }
}

export async function down(): Promise<void> {
    try {
        await pool.query(`
            -- Drop triggers and functions
            DROP TRIGGER IF EXISTS update_members_updated_at ON members;
            DROP FUNCTION IF EXISTS update_updated_at_column();

            -- Drop table
            DROP TABLE IF EXISTS members;

            -- Drop custom types
            DROP TYPE IF EXISTS membership_type_enum;
            DROP TYPE IF EXISTS member_status_enum;

            -- Drop extension if no other tables need it
            DROP EXTENSION IF EXISTS "uuid-ossp";
        `);

        console.log('Migration down completed successfully');
    } catch (error) {
        console.error('Migration down failed:', error);
        throw error;
    }
}

// // Run migration if this file is being executed directly
// if (require.main === module) {
//     const action = process.argv[2] || 'up';
    
//     if (action === 'up') {
//         up().then(() => {
//             console.log('Migration completed');
//             process.exit(0);
//         }).catch(error => {
//             console.error('Migration failed:', error);
//             process.exit(1);
//         });
//     } else if (action === 'down') {
//         down().then(() => {
//             console.log('Rollback completed');
//             process.exit(0);
//         }).catch(error => {
//             console.error('Rollback failed:', error);
//             process.exit(1);
//         });
//     } else {
//         console.error('Invalid action. Use "up" or "down"');
//         process.exit(1);
//     }
// }