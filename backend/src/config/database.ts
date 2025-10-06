import { DataSource } from "typeorm";
import dotenv from "dotenv";
// Update the import path to the correct location of Member model
import { Member } from "../models/Member";
// If the file is named differently or located elsewhere, adjust the path accordingly.
// For example:
// import { Member } from "../entities/Member";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "gms_db",
  entities: [Member],
  synchronize: false,
  logging: true,
  //migrations: ["src/migrations/*.ts"],
  subscribers: [],
});