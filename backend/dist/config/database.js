"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
// Update the import path to the correct location of Member model
const Member_1 = require("../models/Member");
// If the file is named differently or located elsewhere, adjust the path accordingly.
// For example:
// import { Member } from "../entities/Member";
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "gms_db",
    entities: [Member_1.Member],
    synchronize: false,
    logging: true,
    //migrations: ["src/migrations/*.ts"],
    subscribers: [],
});
