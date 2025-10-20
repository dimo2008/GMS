import { UserService } from "../services/UserService";
import { User } from "../models/User";
import { RoleRepository } from "../repositories/RoleRepository";

describe('UserService (role handling)', () => {
    let service: UserService;

    let roleRepo: RoleRepository;

    beforeEach(() => {
        service = new UserService();
        roleRepo = new RoleRepository();
    });

    const uniqueStr = () => Math.random().toString(36).slice(2, 10);

    it('should create a user with provided valid role', async () => {
        const data = {
            firstName: 'Role',
            lastName: 'Tester',
            email: `role.${uniqueStr()}@example.com`,
            username: `role_user_${uniqueStr()}`,
            password: 'Password123!',
            role: 'admin'
        } as any;

        const created = await service.createUser(data);
    expect(created).toBeDefined();
    expect(created.roleId).toBeDefined();
    const r = await roleRepo.findById(created.roleId!);
    expect(r).not.toBeNull();
    expect(r!.name).toBe('admin');
    });

    it('should default role to receptionist when omitted', async () => {
        const data = {
            firstName: 'Default',
            lastName: 'Role',
            email: `default.${uniqueStr()}@example.com`,
            username: `default_user_${uniqueStr()}`,
            password: 'Password123!'
        } as any;

        const created = await service.createUser(data);
    expect(created).toBeDefined();
    expect(created.roleId).toBeDefined();
    const r = await roleRepo.findById(created.roleId!);
    expect(r).not.toBeNull();
    expect(r!.name).toBe('receptionist');
    });

    it('should reject invalid role', async () => {
        const data = {
            firstName: 'Bad',
            lastName: 'Role',
            email: `bad.${uniqueStr()}@example.com`,
            username: `bad_user_${uniqueStr()}`,
            password: 'Password123!',
            role: 'superuser'
        } as any;

        let threw = false;
        try {
            await service.createUser(data as any);
        } catch (err) {
            threw = true;
            expect((err as Error).message).toContain('Invalid role');
        }
        expect(threw).toBe(true);
    });
});
