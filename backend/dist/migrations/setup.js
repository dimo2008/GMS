"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
// Load environment variables with debug logging
dotenv.config({
    path: path.join(__dirname, '../../.env'),
    debug: process.env.DEBUG === 'true'
});
function checkDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Checking database connection...');
        const pool = new pg_1.Pool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: 'postgres' // Connect to default database first
        });
        try {
            // Check if our target database exists
            const result = yield pool.query("SELECT datname FROM pg_database WHERE datname = $1", [process.env.DB_NAME || 'gms_db']);
            if (result.rows.length === 0) {
                console.log('Creating database...');
                yield pool.query(`CREATE DATABASE ${process.env.DB_NAME || 'gms_db'}`);
                console.log('Database created successfully');
            }
            else {
                console.log('Database already exists');
            }
        }
        catch (error) {
            console.error('Error checking/creating database:', error);
            throw error;
        }
        finally {
            yield pool.end();
        }
    });
}
function runMigration() {
    return __awaiter(this, void 0, void 0, function* () {
        const dbPool = new pg_1.Pool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'gms_db'
        });
        try {
            console.log('Running migrations...');
            // Create UUID extension
            // await dbPool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
            // Create members table
            yield dbPool.query(`
            CREATE TABLE IF NOT EXISTS members (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(20),
                membership_type VARCHAR(50) NOT NULL,
                start_date TIMESTAMP NOT NULL,
                end_date TIMESTAMP NOT NULL,
                status VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT chk_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
                CONSTRAINT chk_membership_type CHECK (membership_type IN ('STANDARD', 'PREMIUM', 'VIP'))
            );

            CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
            CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);

            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_members_updated_at') THEN
                    CREATE OR REPLACE FUNCTION update_updated_at_column()
                    RETURNS TRIGGER AS $$
                    BEGIN
                        NEW.updated_at = CURRENT_TIMESTAMP;
                        RETURN NEW;
                    END;
                    $$ language 'plpgsql';

                    CREATE TRIGGER update_members_updated_at
                        BEFORE UPDATE ON members
                        FOR EACH ROW
                        EXECUTE FUNCTION update_updated_at_column();
                END IF;
            END $$;
        `);
            console.log('Migration completed successfully');
        }
        catch (error) {
            console.error('Migration failed:', error);
            throw error;
        }
        finally {
            yield dbPool.end();
        }
    });
}
function setupDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting database setup...');
        try {
            // First check and create database if needed
            yield checkDatabase();
            // Then run the migration
            yield runMigration();
            console.log('Database setup completed successfully');
            process.exit(0);
        }
        catch (error) {
            console.error('Database setup failed:', error);
            process.exit(1);
        }
    });
}
// Run the setup if this file is being executed directly
if (require.main === module) {
    setupDatabase();
}
