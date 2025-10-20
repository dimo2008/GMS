import { UserRepository } from "../repositories/UserRepository";
import { RoleRepository } from "../repositories/RoleRepository";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
    private repo: UserRepository;
    private roleRepo: RoleRepository;

    constructor() {
        this.repo = new UserRepository();
        this.roleRepo = new RoleRepository();
    }

    async authenticate(identifier: string, password: string) {
        // identifier can be username or email
        let user = await this.repo.findByUsername(identifier);
        if (!user) user = await this.repo.findByEmail(identifier);
        if (!user) throw new Error('Invalid credentials');

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new Error('Invalid credentials');

        // resolve role name from roleId
        let roleName: string | null = null;
        if ((user as any).roleId) {
            const r = await this.roleRepo.findById((user as any).roleId);
            roleName = r ? r.name : null;
        }

        const payload = { sub: user.id, username: user.username, role: roleName };
        const secret = process.env.JWT_SECRET || 'CHANGE_ME_TO_SECRET_IN_PROD';
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        // return sanitized user and token
        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            role: roleName,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return { user: safeUser, token };
    }
}
