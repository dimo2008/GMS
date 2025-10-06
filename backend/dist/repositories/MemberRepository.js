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
exports.MemberRepository = void 0;
const pg_1 = require("pg");
const Member_1 = require("../models/Member");
class MemberRepository {
    constructor() {
        this.pool = new pg_1.Pool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'gms_db'
        });
    }
    create(member) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            INSERT INTO members (
                first_name, 
                last_name, 
                email, 
                phone, 
                membership_type, 
                start_date, 
                end_date, 
                status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`;
            const values = [
                member.firstName,
                member.lastName,
                member.email,
                member.phone,
                member.membershipType,
                member.startDate,
                member.endDate,
                member.status
            ];
            const result = yield this.pool.query(query, values);
            return this.mapRowToMember(result.rows[0]);
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM members';
            const result = yield this.pool.query(query);
            return result.rows.map(row => this.mapRowToMember(row));
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM members WHERE id = $1';
            const result = yield this.pool.query(query, [id]);
            return result.rows.length ? this.mapRowToMember(result.rows[0]) : null;
        });
    }
    update(id, member) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = [];
            const values = [];
            let paramCount = 1;
            // Dynamically build update fields
            if (member.firstName) {
                fields.push(`first_name = $${paramCount++}`);
                values.push(member.firstName);
            }
            if (member.lastName) {
                fields.push(`last_name = $${paramCount++}`);
                values.push(member.lastName);
            }
            if (member.email) {
                fields.push(`email = $${paramCount++}`);
                values.push(member.email);
            }
            if (member.phone) {
                fields.push(`phone = $${paramCount++}`);
                values.push(member.phone);
            }
            if (member.membershipType) {
                fields.push(`membership_type = $${paramCount++}`);
                values.push(member.membershipType);
            }
            if (member.startDate) {
                fields.push(`start_date = $${paramCount++}`);
                values.push(member.startDate);
            }
            if (member.endDate) {
                fields.push(`end_date = $${paramCount++}`);
                values.push(member.endDate);
            }
            if (member.status) {
                fields.push(`status = $${paramCount++}`);
                values.push(member.status);
            }
            if (fields.length === 0)
                return null;
            values.push(id);
            const query = `
            UPDATE members 
            SET ${fields.join(', ')} 
            WHERE id = $${paramCount}
            RETURNING *`;
            const result = yield this.pool.query(query, values);
            return result.rows.length ? this.mapRowToMember(result.rows[0]) : null;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'DELETE FROM members WHERE id = $1';
            yield this.pool.query(query, [id]);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM members WHERE email = $1';
            const result = yield this.pool.query(query, [email]);
            return result.rows.length ? this.mapRowToMember(result.rows[0]) : null;
        });
    }
    mapRowToMember(row) {
        const member = new Member_1.Member();
        member.id = row.id;
        member.firstName = row.first_name;
        member.lastName = row.last_name;
        member.email = row.email;
        member.phone = row.phone;
        member.membershipType = row.membership_type;
        member.startDate = row.start_date;
        member.endDate = row.end_date;
        member.status = row.status;
        return member;
    }
    closeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pool.end();
        });
    }
}
exports.MemberRepository = MemberRepository;
