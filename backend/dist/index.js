"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const database_1 = require("./config/database");
const MemberController_1 = require("./controllers/MemberController");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const memberController = new MemberController_1.MemberController();
// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Gym Management System API",
            version: "1.0.0",
            description: "API documentation for GMS"
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server"
            }
        ],
        components: {
            schemas: {
                Member: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        firstName: { type: "string" },
                        lastName: { type: "string" },
                        email: { type: "string", format: "email" },
                        phone: { type: "string" },
                        membershipType: { type: "string", enum: ["STANDARD", "PREMIUM", "VIP"] },
                        startDate: { type: "string", format: "date-time" },
                        endDate: { type: "string", format: "date-time" },
                        status: { type: "string", enum: ["ACTIVE", "INACTIVE", "SUSPENDED"] },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                }
            }
        }
    },
    apis: ["./src/controllers/*.ts"]
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Member routes
app.post("/api/members", (req, res) => memberController.create(req, res));
app.get("/api/members", (req, res) => memberController.getAll(req, res));
app.get("/api/members/:id", (req, res) => memberController.getById(req, res));
app.put("/api/members/:id", (req, res) => memberController.update(req, res));
app.delete("/api/members/:id", (req, res) => memberController.delete(req, res));
// Initialize database connection
database_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connection initialized");
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
    });
})
    .catch((error) => console.log("Error during Data Source initialization", error));
