import { Pool } from 'pg';
import { Member } from '../models/Member';

export class MemberRepository {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'gms_db'
        });
    }

    async create(member: Partial<Member>): Promise<Member> {
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

        const result = await this.pool.query(query, values);
        return this.mapRowToMember(result.rows[0]);
    }

    async findAll(): Promise<Member[]> {
        const query = 'SELECT * FROM members';
        const result = await this.pool.query(query);
        return result.rows.map(row => this.mapRowToMember(row));
    }

    async findById(id: string): Promise<Member | null> {
        const query = 'SELECT * FROM members WHERE id = $1';
        const result = await this.pool.query(query, [id]);
        return result.rows.length ? this.mapRowToMember(result.rows[0]) : null;
    }

    async update(id: string, member: Partial<Member>): Promise<Member | null> {
        const fields: string[] = [];
        const values: any[] = [];
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

        if (fields.length === 0) return null;

        values.push(id);
        const query = `
            UPDATE members 
            SET ${fields.join(', ')} 
            WHERE id = $${paramCount}
            RETURNING *`;

        const result = await this.pool.query(query, values);
        return result.rows.length ? this.mapRowToMember(result.rows[0]) : null;
    }

    async delete(id: string): Promise<void> {
        const query = 'DELETE FROM members WHERE id = $1';
        await this.pool.query(query, [id]);
    }

    async findByEmail(email: string): Promise<Member | null> {
        const query = 'SELECT * FROM members WHERE email = $1';
        const result = await this.pool.query(query, [email]);
        return result.rows.length ? this.mapRowToMember(result.rows[0]) : null;
    }

    private mapRowToMember(row: any): Member {
        const member = new Member();
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

    async closeConnection(): Promise<void> {
        await this.pool.end();
    }
}