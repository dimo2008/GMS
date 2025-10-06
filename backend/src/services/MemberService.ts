import { Member } from "../models/Member";
import { MemberRepository } from "../repositories/MemberRepository";

export class MemberService {
    private repository: MemberRepository;

    constructor() {
        this.repository = new MemberRepository();
    }
//createMember 3
    async createMember(memberData: Partial<Member>): Promise<Member> {
        // Validate required fields
        if (!memberData.firstName || !memberData.lastName || !memberData.email) {
            throw new Error('First name, last name, and email are required');
        }

        // Check if email already exists
        const existingMember = await this.repository.findByEmail(memberData.email);
        if (existingMember) {
            throw new Error('Member with this email already exists');
        }

        // Set default values if not provided
        const now = new Date();
        const defaultEndDate = new Date();
        defaultEndDate.setMonth(defaultEndDate.getMonth() + 1); // Default to 1 month membership

        const memberToCreate: Partial<Member> = {
            ...memberData,
            status: memberData.status || 'ACTIVE',
            startDate: memberData.startDate || now,
            endDate: memberData.endDate || defaultEndDate,
            membershipType: memberData.membershipType || 'STANDARD'
        };

        return await this.repository.create(memberToCreate);
    }

    async getAllMembers(): Promise<Member[]> {
        return await this.repository.findAll();
    }

    async getMemberById(id: string): Promise<Member | null> {
        if (!id) {
            throw new Error('Member ID is required');
        }
        return await this.repository.findById(id);
    }

    async updateMember(id: string, memberData: Partial<Member>): Promise<Member | null> {
        if (!id) {
            throw new Error('Member ID is required');
        }

        const existingMember = await this.repository.findById(id);
        if (!existingMember) {
            throw new Error('Member not found');
        }

        // If email is being updated, check if it's already taken
        if (memberData.email && memberData.email !== existingMember.email) {
            const emailExists = await this.repository.findByEmail(memberData.email);
            if (emailExists) {
                throw new Error('Email already in use');
            }
        }

        return await this.repository.update(id, memberData);
    }

    async deleteMember(id: string): Promise<void> {
        if (!id) {
            throw new Error('Member ID is required');
        }

        const member = await this.repository.findById(id);
        if (!member) {
            throw new Error('Member not found');
        }

        await this.repository.delete(id);
    }

    // Additional business logic methods
    async renewMembership(id: string, months: number): Promise<Member | null> {
        const member = await this.repository.findById(id);
        if (!member) {
            throw new Error('Member not found');
        }

        const newEndDate = new Date(member.endDate);
        newEndDate.setMonth(newEndDate.getMonth() + months);

        return await this.repository.update(id, {
            endDate: newEndDate,
            status: 'ACTIVE'
        });
    }

    async deactivateMember(id: string): Promise<Member | null> {
        const member = await this.repository.findById(id);
        if (!member) {
            throw new Error('Member not found');
        }

        return await this.repository.update(id, { status: 'INACTIVE' });
    }
}