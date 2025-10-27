export type MembershipType = 'STANDARD' | 'PREMIUM' | 'VIP';
export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export class Member {
    id!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    phone!: string;
    membershipType!: MembershipType;
    startDate!: Date;
    endDate!: Date;
    status!: MemberStatus;
    createdAt?: Date;
    updatedAt?: Date; //comment
}