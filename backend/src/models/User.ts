export class User {
    id!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    username!: string;
    // store hashed password
    passwordHash!: string;
    // reference to roles.id (UUID)
    roleId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
