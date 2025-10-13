import { UserRepository } from "../repositories/UserRepository";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
    private repo: UserRepository;

    constructor() {
        this.repo = new UserRepository();
    }

    async authenticate(identifier: string, password: string) {
        // identifier can be username or email
        let user = await this.repo.findByUsername(identifier);
        if (!user) user = await this.repo.findByEmail(identifier);
        if (!user) throw new Error('Invalid credentials');

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) throw new Error('Invalid credentials');

        const payload = { sub: user.id, username: user.username };
        const secret = process.env.JWT_SECRET || 'CHANGE_ME_TO_SECRET_IN_PROD';
        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        // return sanitized user and token
        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return { user: safeUser, token };
    }
}
