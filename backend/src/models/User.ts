import { Role } from "./Role";
export class User {
    id!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    username!: string;
    // store hashed password
    passwordHash!: string;
    // multiple roles
    roles?: Role[];
    createdAt?: Date;
    updatedAt?: Date;
}
