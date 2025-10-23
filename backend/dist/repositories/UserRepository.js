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
                password_hash
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING *`;
            const values = [
                user.firstName,
                user.lastName,
                user.email,
                user.username,
                user.passwordHash
            ];
            const result = yield this.pool.query(query, values);
            const createdUser = this.mapRowToUser(result.rows[0]);
            // assign roles if provided
            if (user.roles && user.roles.length > 0) {
                for (const role of user.roles) {
                    yield this.pool.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [createdUser.id, role.id]);
                }
            }
            createdUser.roles = yield this.getUserRoles(createdUser.id);
            return createdUser;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query('SELECT * FROM users');
            const users = result.rows.map(r => this.mapRowToUser(r));
            for (const user of users) {
                user.roles = yield this.getUserRoles(user.id);
            }
            return users;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
            if (!result.rows.length)
                return null;
            const user = this.mapRowToUser(result.rows[0]);
            user.roles = yield this.getUserRoles(user.id);
            return user;
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
            if (user.passwordHash) {
                fields.push(`password_hash = $${paramCount++}`);
                values.push(user.passwordHash);
            }
            if (fields.length > 0) {
                values.push(id);
                const query = `
                UPDATE users
                SET ${fields.join(', ')}
                WHERE id = $${paramCount}
                RETURNING *`;
                yield this.pool.query(query, values);
            }
            // update roles if provided
            if (user.roles) {
                // remove all current roles
                yield this.pool.query('DELETE FROM user_roles WHERE user_id = $1', [id]);
                // add new roles
                for (const role of user.roles) {
                    yield this.pool.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [id, role.id]);
                }
            }
            // return updated user
            return yield this.findById(id);
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
        u.passwordHash = row.password_hash;
        u.createdAt = row.created_at;
        u.updatedAt = row.updated_at;
        // roles will be loaded separately
        return u;
    }
    getUserRoles(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query(`SELECT r.* FROM roles r
             INNER JOIN user_roles ur ON ur.role_id = r.id
             WHERE ur.user_id = $1`, [userId]);
            return result.rows.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                };
            });
        });
    }
    addRoleToUser(userId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pool.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userId, roleId]);
        });
    }
    removeRoleFromUser(userId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pool.query('DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2', [userId, roleId]);
        });
    }
    userHasRole(userId, roleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.pool.query('SELECT 1 FROM user_roles WHERE user_id = $1 AND role_id = $2', [userId, roleId]);
            return !!(result && result.rowCount && result.rowCount > 0);
        });
    }
}
exports.UserRepository = UserRepository;
