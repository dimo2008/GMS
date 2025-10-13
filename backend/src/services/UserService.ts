import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from 'bcryptjs';

export class UserService {
    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
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

        const toCreate: Partial<User> = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            username: data.username,
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

        return await this.repository.update(id, data);
    }

    async deleteUser(id: string): Promise<void> {
        if (!id) throw new Error('User id is required');
        const u = await this.repository.findById(id);
        if (!u) throw new Error('User not found');
        await this.repository.delete(id);
    }
}
