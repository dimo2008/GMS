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

        // handle roles: accept roles array or single role, default to receptionist
        const allowedRoles = ['admin', 'receptionist'];
        let roleNames: string[] = [];
        if (Array.isArray((data as any).roles) && (data as any).roles.length > 0) {
            roleNames = (data as any).roles;
        } else if ((data as any).role) {
                    roleNames = [String((data as any).role)];
                } else {
                    roleNames = ['receptionist']; // default if nothing provided
                }
                for (const name of roleNames) {
                    if (!allowedRoles.includes(name)) throw new Error(`Invalid role: ${name}. Allowed: ${allowedRoles.join(', ')}`);
                }
                // find or create all roles
                const roles = [];
                for (const name of roleNames) {
                    let role = await this.roleRepo.findByName(name);
                    if (!role) role = await this.roleRepo.create({ name });
                    roles.push(role);
                }

                const toCreate: Partial<User> = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    username: data.username,
                    passwordHash: hash,
                    roles
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

                // handle roles: accept roles array or single role, default to receptionist if not provided
                const allowedRoles = ['admin', 'receptionist'];
                let roleNames: string[] | undefined = undefined;
                if (Array.isArray((data as any).roles) && (data as any).roles.length > 0) {
                    roleNames = (data as any).roles;
                } else if ((data as any).role) {
                    roleNames = [String((data as any).role)];
                }
                if (!roleNames || roleNames.length === 0) {
                    roleNames = ['receptionist']; // default if nothing provided
                }
                if (roleNames) {
                    for (const name of roleNames) {
                        if (!allowedRoles.includes(name)) throw new Error(`Invalid role: ${name}. Allowed: ${allowedRoles.join(', ')}`);
                    }
                    // find or create all roles
                    const roles = [];
                    for (const name of roleNames) {
                        let role = await this.roleRepo.findByName(name);
                        if (!role) role = await this.roleRepo.create({ name });
                        roles.push(role);
                    }
                    (data as any).roles = roles;
                    delete (data as any).role;
                }
                return await this.repository.update(id, data);
            }

            async deleteUser(id: string): Promise<void> {
                if (!id) throw new Error('User id is required');
                const user = await this.repository.findById(id);
                if (!user) throw new Error('User not found');
                await this.repository.delete(id);
            }

            async assignRolesToUser(userId: string, roleNames: string[]): Promise<User | null> {
                if (!userId) throw new Error('User id is required');
                if (!Array.isArray(roleNames) || roleNames.length === 0) throw new Error('At least one role is required');
                const allowedRoles = ['admin', 'receptionist'];
                for (const name of roleNames) {
                    if (!allowedRoles.includes(name)) throw new Error(`Invalid role: ${name}. Allowed: ${allowedRoles.join(', ')}`);
                }
                const user = await this.repository.findById(userId);
                if (!user) throw new Error('User not found');
                // find or create all roles
                const roles = [];
                for (const name of roleNames) {
                    let role = await this.roleRepo.findByName(name);
                    if (!role) role = await this.roleRepo.create({ name });
                    roles.push(role);
                }
                // update user roles
                return await this.repository.update(userId, { roles });
            }

            async grantRoleToUser(userId: string, roleName: string): Promise<User | null> {
                if (!userId) throw new Error('User id is required');
                if (!roleName) throw new Error('Role name is required');
                const user = await this.repository.findById(userId);
                if (!user) throw new Error('User not found');

                let role = await this.roleRepo.findByName(roleName);
                if (!role) role = await this.roleRepo.create({ name: roleName });

                await this.repository.addRoleToUser(userId, role.id);
                return await this.repository.findById(userId);
            }

            async revokeRoleFromUser(userId: string, roleName: string): Promise<User | null> {
                if (!userId) throw new Error('User id is required');
                if (!roleName) throw new Error('Role name is required');
                const user = await this.repository.findById(userId);
                if (!user) throw new Error('User not found');

                const role = await this.roleRepo.findByName(roleName);
                if (!role) throw new Error('Role not found');

                await this.repository.removeRoleFromUser(userId, role.id);
                return await this.repository.findById(userId);
            }

            async userHasRole(userId: string, roleName: string): Promise<boolean> {
                if (!userId) throw new Error('User id is required');
                if (!roleName) throw new Error('Role name is required');
                const user = await this.repository.findById(userId);
                if (!user) throw new Error('User not found');

                const role = await this.roleRepo.findByName(roleName);
                if (!role) return false;

                return await this.repository.userHasRole(userId, role.id);
            }
        }
