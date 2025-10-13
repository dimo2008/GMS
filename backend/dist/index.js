"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const database_1 = require("./config/database");
const _1696600000000_CreateMembersTable_1 = require("./migrations/1696600000000-CreateMembersTable");
const _1696700000000_CreateUsersTable_1 = require("./migrations/1696700000000-CreateUsersTable");
const MemberController_1 = require("./controllers/MemberController");
const UserController_1 = require("./controllers/UserController");
const AuthController_1 = require("./controllers/AuthController");
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
        tags: [
            { name: 'Members', description: 'Member management endpoints' },
            { name: 'Users', description: 'User management and accounts' },
            { name: 'Auth', description: 'Authentication endpoints' }
        ],
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
                },
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string", format: "uuid" },
                        firstName: { type: "string" },
                        lastName: { type: "string" },
                        email: { type: "string", format: "email" },
                        username: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" }
                    }
                },
                AuthResponse: {
                    type: "object",
                    properties: {
                        user: { $ref: '#/components/schemas/User' },
                        token: { type: 'string' }
                    }
                }
            }
        }
    },
    apis: ["./src/controllers/*.ts"]
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
const customCss = `
#download-openapi-btn {
    background: #005a9e;
    color: #fff;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 16px;
    margin-bottom: 16px;
    cursor: pointer;
}
`;
const customJs = `
window.onload = function() {
    var btn = document.createElement('button');
    btn.id = 'download-openapi-btn';
    btn.innerText = 'Download OpenAPI JSON';
    btn.onclick = function() {
        window.open('/api-docs/openapi.json', '_blank');
    };
    var container = document.querySelector('.swagger-ui');
    if (container) {
        container.insertBefore(btn, container.firstChild);
    }
};
`;
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs, {
    customCss,
    customJs
}));
// Export OpenAPI spec for Postman import
app.get("/api-docs/openapi.json", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});
// Member routes
app.use("/api/members", MemberController_1.MemberRouter);
// User routes
app.use("/api/users", UserController_1.UserRouter);
// Auth routes
app.use("/api/auth", AuthController_1.AuthRouter);
// Initialize database connection
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Run all migration up functions
            console.log("Running migrations...");
            yield (0, _1696600000000_CreateMembersTable_1.up)();
            yield (0, _1696700000000_CreateUsersTable_1.up)();
            yield database_1.AppDataSource.initialize();
            console.log("Database connection initialized");
            const port = process.env.PORT || 3000;
            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
                console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
            });
        }
        catch (error) {
            console.log("Error during startup", error);
        }
    });
}
startServer();
