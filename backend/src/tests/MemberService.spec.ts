import { MemberService } from "../services/MemberService";
import { Member } from "../models/Member";
import { MemberRepository } from "../repositories/MemberRepository";

describe("MemberService", () => {
    let service: MemberService;
    let repository: MemberRepository;

    beforeEach(() => {
        service = new MemberService();
        repository = new MemberRepository();
    });

    const mockMemberData: Partial<Member|null> = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "1234567890",
        membershipType: "PREMIUM",
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: "ACTIVE"
    };

    it("should create a new member", async () => {
        const createdMember = await service.createMember(mockMemberData);
        expect(createdMember).toBeDefined();
        expect(createdMember.email).toBeDefined();
        // expect(createdMember.email).toBe(mockMemberData.email);
    });

    it("should get all members", async () => {
        const members = await service.getAllMembers();
        expect(Array.isArray(members)).toBe(true);
    });

    it("should get member by id", async () => {
        const createdMember = await service.createMember(mockMemberData);
        const foundMember = await service.getMemberById(createdMember.id);
        expect(foundMember).toBeDefined();
        expect(foundMember?.email).toBe(mockMemberData.email);
    });

    it("should update member", async () => {
        const createdMember = await service.createMember(mockMemberData);
        const updatedData = { firstName: "Jane" };
        const updatedMember = await service.updateMember(createdMember.id, updatedData);
        expect(updatedMember?.firstName).toBe("Jane");
    });

    it("should delete member", async () => {
        const createdMember = await service.createMember(mockMemberData);
        await service.deleteMember(createdMember.id);
        const foundMember = await service.getMemberById(createdMember.id);
        expect(foundMember).toBeNull();
    });
});