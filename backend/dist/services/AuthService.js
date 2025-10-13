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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    constructor() {
        this.repo = new UserRepository_1.UserRepository();
    }
    authenticate(identifier, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // identifier can be username or email
            let user = yield this.repo.findByUsername(identifier);
            if (!user)
                user = yield this.repo.findByEmail(identifier);
            if (!user)
                throw new Error('Invalid credentials');
            const valid = yield bcryptjs_1.default.compare(password, user.passwordHash);
            if (!valid)
                throw new Error('Invalid credentials');
            const payload = { sub: user.id, username: user.username };
            const secret = process.env.JWT_SECRET || 'CHANGE_ME_TO_SECRET_IN_PROD';
            const token = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: '1h' });
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
        });
    }
}
exports.AuthService = AuthService;
