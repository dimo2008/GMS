"use strict";
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
exports.UserRepository = void 0;
const pg_1 = require("pg");
const User_1 = require("../models/User");
class UserRepository {
    constructor() {
        this.pool = new pg_1.Pool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'gms_db'
        });
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const result = yield this.pool.query(query, values);
            return this.mapRowToUser(result.rows[0]);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query('SELECT * FROM users');
            return result.rows.map(r => this.mapRowToUser(r));
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
            return result.rows.length ? this.mapRowToUser(result.rows[0]) : null;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
            return result.rows.length ? this.mapRowToUser(result.rows[0]) : null;
        });
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query('SELECT * FROM users WHERE username = $1', [username]);
            return result.rows.length ? this.mapRowToUser(result.rows[0]) : null;
        });
    }
    update(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = [];
            const values = [];
            let paramCount = 1;
            if (user.firstName) {
                fields.push(`first_name = $${paramCount++}`);
                values.push(user.firstName);
            }
            if (user.lastName) {
                fields.push(`last_name = $${paramCount++}`);
                values.push(user.lastName);
            }
            if (user.email) {
                fields.push(`email = $${paramCount++}`);
                values.push(user.email);
            }
            if (user.username) {
                fields.push(`username = $${paramCount++}`);
                values.push(user.username);
            }
            if (user.roleId) {
                fields.push(`role_id = $${paramCount++}`);
                values.push(user.roleId);
            }
            if (user.passwordHash) {
                fields.push(`password_hash = $${paramCount++}`);
                values.push(user.passwordHash);
            }
            if (fields.length === 0)
                return null;
            values.push(id);
            const query = `
            UPDATE users
            SET ${fields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *`;
            const result = yield this.pool.query(query, values);
            return result.rows.length ? this.mapRowToUser(result.rows[0]) : null;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pool.query('DELETE FROM users WHERE id = $1', [id]);
        });
    }
    mapRowToUser(row) {
        const u = new User_1.User();
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
exports.UserRepository = UserRepository;
