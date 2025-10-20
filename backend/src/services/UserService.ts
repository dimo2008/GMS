import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import bcrypt from 'bcryptjs';

export class UserService {
    private repository: UserRepository;
    private roleRepo: RoleRepository;

    constructor() {
        this.repository = new UserRepository();
        this.roleRepo = new RoleRepository();
    }

    async createUser(data: Partial<User>): Promise<User> {
        // expect `password` in request body (plain text)
        if (!data.firstName || !data.lastName || !data.email || !data.username || !(data as any).password) {
            throw new Error('firstName, lastName, email, username and password are required');
        }

        // check uniqueness
        const existingEmail = await this.repository.findByEmail(data.email);
        if (existingEmail) throw new Error('Email already in use');
        const existingUsername = await this.repository.findByUsername(data.username);
        if (existingUsername) throw new Error('Username already in use');

    // hash password (expect plain `password` in the request)
    const plainPassword = (data as any).password as string;
    const hash = await bcrypt.hash(plainPassword, 10);

        // handle role by name -> roleId
        const allowedRoles = ['admin', 'receptionist'];
        const roleName = (data as any).role ? String((data as any).role) : 'receptionist';
        if (!allowedRoles.includes(roleName)) throw new Error(`Invalid role. Allowed: ${allowedRoles.join(', ')}`);

        // find or create role record
        let roleRecord = await this.roleRepo.findByName(roleName);
        if (!roleRecord) {
            roleRecord = await this.roleRepo.create({ name: roleName });
        }

        const toCreate: Partial<User> = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            username: data.username,
            roleId: roleRecord.id,
            passwordHash: hash
        };

        return await this.repository.create(toCreate);
    }

    async getAllUsers(): Promise<User[]> {
        return await this.repository.findAll();
    }

    async getUserById(id: string): Promise<User | null> {
        if (!id) throw new Error('User id is required');
        return await this.repository.findById(id);
    }

    async updateUser(id: string, data: Partial<User>): Promise<User | null> {
        if (!id) throw new Error('User id is required');

        const existing = await this.repository.findById(id);
        if (!existing) throw new Error('User not found');

        if (data.email && data.email !== existing.email) {
            const e = await this.repository.findByEmail(data.email);
            if (e) throw new Error('Email already in use');
        }
        if (data.username && data.username !== existing.username) {
            const u = await this.repository.findByUsername(data.username);
            if (u) throw new Error('Username already in use');
        }

        // if client passed `password` (plain) hash it into passwordHash
        if ((data as any).password) {
            (data as any).passwordHash = await bcrypt.hash((data as any).password, 10);
            delete (data as any).password;
        }

        // if role provided, validate and translate to roleId
        if ((data as any).role) {
            const roleNameUpdate = String((data as any).role);
            const allowedRolesUpdate = ['admin', 'receptionist'];
            if (!allowedRolesUpdate.includes(roleNameUpdate)) throw new Error(`Invalid role. Allowed: ${allowedRolesUpdate.join(', ')}`);
            let rr = await this.roleRepo.findByName(roleNameUpdate);
            if (!rr) rr = await this.roleRepo.create({ name: roleNameUpdate });
            (data as any).roleId = rr.id;
            delete (data as any).role;
        }

        return await this.repository.update(id, data);
    }

    async deleteUser(id: string): Promise<void> {
        if (!id) throw new Error('User id is required');
        const u = await this.repository.findById(id);
        if (!u) throw new Error('User not found');
        await this.repository.delete(id);
    }
}
