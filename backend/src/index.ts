import express from "express";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { AppDataSource } from "./config/database";
import { up as membersUp } from "./migrations/1696600000000-CreateMembersTable";
import { up as usersUp } from "./migrations/1696700000000-CreateUsersTable";
import { MemberController, MemberRouter } from "./controllers/MemberController";
import { UserRouter } from "./controllers/UserController";
import { AuthRouter } from "./controllers/AuthController";

const app = express();
app.use(express.json());
app.use(cors());

const memberController = new MemberController();

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

const swaggerDocs = swaggerJsDoc(swaggerOptions);

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
    customCss,
    customJs
}));

// Export OpenAPI spec for Postman import
app.get("/api-docs/openapi.json", (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});

// Member routes
app.use("/api/members", MemberRouter);
// User routes
app.use("/api/users", UserRouter);
// Auth routes
app.use("/api/auth", AuthRouter);

// Initialize database connection
async function startServer() {
    try {
    // Run all migration up functions
    console.log("Running migrations...");
    await membersUp();
    await usersUp();
        await AppDataSource.initialize();
        console.log("Database connection initialized");
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
        });
    } catch (error) {
        console.log("Error during startup", error);
    }
}

startServer();