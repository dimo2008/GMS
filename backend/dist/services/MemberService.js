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
exports.MemberService = void 0;
const MemberRepository_1 = require("../repositories/MemberRepository");
class MemberService {
    constructor() {
        this.repository = new MemberRepository_1.MemberRepository();
    }
    createMember(memberData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate required fields
            if (!memberData.firstName || !memberData.lastName || !memberData.email) {
                throw new Error('First name, last name, and email are required');
            }
            // Check if email already exists
            const existingMember = yield this.repository.findByEmail(memberData.email);
            if (existingMember) {
                throw new Error('Member with this email already exists');
            }
            // Set default values if not provided
            const now = new Date();
            const defaultEndDate = new Date();
            defaultEndDate.setMonth(defaultEndDate.getMonth() + 1); // Default to 1 month membership
            const memberToCreate = Object.assign(Object.assign({}, memberData), { status: memberData.status || 'ACTIVE', startDate: memberData.startDate || now, endDate: memberData.endDate || defaultEndDate, membershipType: memberData.membershipType || 'STANDARD' });
            return yield this.repository.create(memberToCreate);
        });
    }
    getAllMembers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.findAll();
        });
    }
    getMemberById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('Member ID is required');
            }
            return yield this.repository.findById(id);
        });
    }
    updateMember(id, memberData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('Member ID is required');
            }
            const existingMember = yield this.repository.findById(id);
            if (!existingMember) {
                throw new Error('Member not found');
            }
            // If email is being updated, check if it's already taken
            if (memberData.email && memberData.email !== existingMember.email) {
                const emailExists = yield this.repository.findByEmail(memberData.email);
                if (emailExists) {
                    throw new Error('Email already in use');
                }
            }
            return yield this.repository.update(id, memberData);
        });
    }
    deleteMember(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id) {
                throw new Error('Member ID is required');
            }
            const member = yield this.repository.findById(id);
            if (!member) {
                throw new Error('Member not found');
            }
            yield this.repository.delete(id);
        });
    }
    // Additional business logic methods
    renewMembership(id, months) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.repository.findById(id);
            if (!member) {
                throw new Error('Member not found');
            }
            const newEndDate = new Date(member.endDate);
            newEndDate.setMonth(newEndDate.getMonth() + months);
            return yield this.repository.update(id, {
                endDate: newEndDate,
                status: 'ACTIVE'
            });
        });
    }
    deactivateMember(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const member = yield this.repository.findById(id);
            if (!member) {
                throw new Error('Member not found');
            }
            return yield this.repository.update(id, { status: 'INACTIVE' });
        });
    }
}
exports.MemberService = MemberService;
