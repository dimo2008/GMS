import { Request, Response, Router } from "express";
import { UserService } from "../services/UserService";

export class UserController {
    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.service.createUser(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error creating user', error });
        }
    }

    /**
     * @swagger
     * /api/users:
     *   post:
     *     summary: Create a new user
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               firstName:
     *                 type: string
     *               lastName:
     *                 type: string
     *               email:
     *                 type: string
     *                 format: email
     *               username:
     *                 type: string
     *               password:
     *                 type: string
    *               role:
    *                 type: string
    *                 enum: [admin, receptionist]
     *     responses:
     *       201:
     *         description: User created
     */

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.service.getAllUsers();
            res.json(users);
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error retrieving users', error });
        }
    }

    /**
     * @swagger
     * /api/users:
     *   get:
     *     summary: Get all users
     *     tags: [Users]
     *     responses:
     *       200:
     *         description: List of users
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     */

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.service.getUserById(req.params.id);
            if (user) res.json(user);
            else res.status(404).json({ message: 'User not found' });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error retrieving user', error });
        }
    }

    /**
     * @swagger
     * /api/users/{id}:
     *   get:
     *     summary: Get user by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: User ID
     *     responses:
     *       200:
     *         description: User object
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       404:
     *         description: User not found
     */

    async update(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.service.updateUser(req.params.id, req.body);
            if (user) res.json(user);
            else res.status(404).json({ message: 'User not found' });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error updating user', error });
        }
    }

    /**
     * @swagger
     * /api/users/{id}:
     *   put:
     *     summary: Update a user
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: User ID
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               firstName:
     *                 type: string
     *               lastName:
     *                 type: string
     *               email:
     *                 type: string
     *                 format: email
     *               username:
     *                 type: string
     *               password:
     *                 type: string
    *               role:
    *                 type: string
    *                 enum: [admin, receptionist]
     *     responses:
     *       200:
     *         description: Updated user object
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       404:
     *         description: User not found
     */

    async delete(req: Request, res: Response): Promise<void> {
        try {
            await this.service.deleteUser(req.params.id);
            res.status(204).send();
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error deleting user', error });
        }
    }
}

export const UserRouter = (() => {
    const controller = new UserController();
    const router = Router();

    router.post('/', (req, res) => controller.create(req, res));
    router.get('/', (req, res) => controller.getAll(req, res));
    router.get('/:id', (req, res) => controller.getById(req, res));
    router.put('/:id', (req, res) => controller.update(req, res));
    router.delete('/:id', (req, res) => controller.delete(req, res));

    return router;
})();
