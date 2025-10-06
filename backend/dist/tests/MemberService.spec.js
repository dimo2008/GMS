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
const MemberService_1 = require("../services/MemberService");
const MemberRepository_1 = require("../repositories/MemberRepository");
describe("MemberService", () => {
    let service;
    let repository;
    beforeEach(() => {
        service = new MemberService_1.MemberService();
        repository = new MemberRepository_1.MemberRepository();
    });
    const mockMemberData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
        membershipType: "PREMIUM",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: "ACTIVE"
    };
    it("should create a new member", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdMember = yield service.createMember(mockMemberData);
        expect(createdMember).toBeDefined();
        expect(createdMember.email).toBeDefined();
        // expect(createdMember.email).toBe(mockMemberData.email);
    }));
    it("should get all members", () => __awaiter(void 0, void 0, void 0, function* () {
        const members = yield service.getAllMembers();
        expect(Array.isArray(members)).toBe(true);
    }));
    it("should get member by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdMember = yield service.createMember(mockMemberData);
        const foundMember = yield service.getMemberById(createdMember.id);
        expect(foundMember).toBeDefined();
        expect(foundMember === null || foundMember === void 0 ? void 0 : foundMember.email).toBe(mockMemberData.email);
    }));
    it("should update member", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdMember = yield service.createMember(mockMemberData);
        const updatedData = { firstName: "Jane" };
        const updatedMember = yield service.updateMember(createdMember.id, updatedData);
        expect(updatedMember === null || updatedMember === void 0 ? void 0 : updatedMember.firstName).toBe("Jane");
    }));
    it("should delete member", () => __awaiter(void 0, void 0, void 0, function* () {
        const createdMember = yield service.createMember(mockMemberData);
        yield service.deleteMember(createdMember.id);
        const foundMember = yield service.getMemberById(createdMember.id);
        expect(foundMember).toBeNull();
    }));
});
