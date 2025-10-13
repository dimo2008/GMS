export class User {
    id!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    username!: string;
    // store hashed password
    passwordHash!: string;
    createdAt?: Date;
    updatedAt?: Date;
}
