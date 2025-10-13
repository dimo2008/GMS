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
exports.UserService = void 0;
const UserRepository_1 = require("../repositories/UserRepository");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserService {
    constructor() {
        this.repository = new UserRepository_1.UserRepository();
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // expect `password` in request body (plain text)
            if (!data.firstName || !data.lastName || !data.email || !data.username || !data.password) {
                throw new Error('firstName, lastName, email, username and password are required');
            }
            // check uniqueness
            const existingEmail = yield this.repository.findByEmail(data.email);
            if (existingEmail)
                throw new Error('Email already in use');
            const existingUsername = yield this.repository.findByUsername(data.username);
            if (existingUsername)
                throw new Error('Username already in use');
            // hash password (expect plain `password` in the request)
            const plainPassword = data.password;
            const hash = yield bcryptjs_1.default.hash(plainPassword, 10);
            const toCreate = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                username: data.username,
                passwordHash: hash
            };
            return yield this.repository.create(toCreate);
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findAll();
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw new Error('User id is required');
            return yield this.repository.findById(id);
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw new Error('User id is required');
            const existing = yield this.repository.findById(id);
            if (!existing)
                throw new Error('User not found');
            if (data.email && data.email !== existing.email) {
                const e = yield this.repository.findByEmail(data.email);
                if (e)
                    throw new Error('Email already in use');
            }
            if (data.username && data.username !== existing.username) {
                const u = yield this.repository.findByUsername(data.username);
                if (u)
                    throw new Error('Username already in use');
            }
            // if client passed `password` (plain) hash it into passwordHash
            if (data.password) {
                data.passwordHash = yield bcryptjs_1.default.hash(data.password, 10);
                delete data.password;
            }
            return yield this.repository.update(id, data);
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id)
                throw new Error('User id is required');
            const u = yield this.repository.findById(id);
            if (!u)
                throw new Error('User not found');
            yield this.repository.delete(id);
        });
    }
}
exports.UserService = UserService;
