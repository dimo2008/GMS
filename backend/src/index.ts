import express from "express";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { AppDataSource } from "./config/database";
import { MemberController } from "./controllers/MemberController";

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

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Member routes
app.post("/api/members", (req, res) => memberController.create(req, res));
app.get("/api/members", (req, res) => memberController.getAll(req, res));
app.get("/api/members/:id", (req, res) => memberController.getById(req, res));
app.put("/api/members/:id", (req, res) => memberController.update(req, res));
app.delete("/api/members/:id", (req, res) => memberController.delete(req, res));

// Initialize database connection
AppDataSource.initialize()
    .then(() => {
        console.log("Database connection initialized");
    const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
        });
    })
    .catch((error) => console.log("Error during Data Source initialization", error));