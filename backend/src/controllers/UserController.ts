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

    /**
     * @swagger
     * /api/users/{id}/roles:
     *   put:
     *     summary: Assign multiple roles to a user
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
     *               roles:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: Array of role names (admin, receptionist)
     *     responses:
     *       200:
     *         description: Updated user object with assigned roles
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Invalid input
     *       404:
     *         description: User not found
     */
    async assignRoles(req: Request, res: Response): Promise<void> {
        try {
            const { roles } = req.body;
            if (!Array.isArray(roles) || roles.length === 0) {
                res.status(400).json({ message: 'roles must be a non-empty array of role names' });
                return;
            }
            const user = await this.service.assignRolesToUser(req.params.id, roles);
            if (user) res.json(user);
            else res.status(404).json({ message: 'User not found' });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error assigning roles', error });
        }
    }

    async grantRole(req: Request, res: Response): Promise<void> {
        try {
            const { role } = req.body;
            if (!role) {
                res.status(400).json({ message: 'role is required in body' });
                return;
            }
            const user = await this.service.grantRoleToUser(req.params.id, role);
            if (user) res.json(user);
            else res.status(404).json({ message: 'User not found' });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error granting role', error });
        }
    }

    /**
     * @swagger
     * /api/users/{id}/roles/grant:
     *   post:
     *     summary: Grant a role to a user
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
     *               role:
     *                 type: string
     *                 description: Role name to grant (e.g. admin)
     *     responses:
     *       200:
     *         description: Updated user object
     */

    async revokeRole(req: Request, res: Response): Promise<void> {
        try {
            const { role } = req.body;
            if (!role) {
                res.status(400).json({ message: 'role is required in body' });
                return;
            }
            const user = await this.service.revokeRoleFromUser(req.params.id, role);
            if (user) res.json(user);
            else res.status(404).json({ message: 'User not found' });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error revoking role', error });
        }
    }

    /**
     * @swagger
     * /api/users/{id}/roles/revoke:
     *   post:
     *     summary: Revoke a role from a user
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
     *               role:
     *                 type: string
     *                 description: Role name to revoke (e.g. admin)
     *     responses:
     *       200:
     *         description: Updated user object
     */

    async hasRole(req: Request, res: Response): Promise<void> {
        try {
            const roleName = req.params.roleName;
            if (!roleName) {
                res.status(400).json({ message: 'roleName is required in path' });
                return;
            }
            const has = await this.service.userHasRole(req.params.id, roleName);
            res.json({ hasRole: has });
        } catch (error: any) {
            res.status(500).json({ message: error.message || 'Error checking role', error });
        }
    }

    /**
     * @swagger
     * /api/users/{id}/roles/{roleName}:
     *   get:
     *     summary: Check if a user has a specific role
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *         description: User ID
     *       - in: path
     *         name: roleName
     *         schema:
     *           type: string
     *         required: true
     *         description: Role name to check
     *     responses:
     *       200:
     *         description: Returns whether the user has the role
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 hasRole:
     *                   type: boolean
     */
}

export const UserRouter = (() => {
    const controller = new UserController();
    const router = Router();

    router.post('/', (req, res) => controller.create(req, res));
    router.get('/', (req, res) => controller.getAll(req, res));
    router.get('/:id', (req, res) => controller.getById(req, res));
    router.put('/:id', (req, res) => controller.update(req, res));

    router.put('/:id/roles', (req, res) => controller.assignRoles(req, res));
    router.post('/:id/roles/grant', (req, res) => controller.grantRole(req, res));
    router.post('/:id/roles/revoke', (req, res) => controller.revokeRole(req, res));
    router.get('/:id/roles/:roleName', (req, res) => controller.hasRole(req, res));
    router.delete('/:id', (req, res) => controller.delete(req, res));

    return router;
})();
