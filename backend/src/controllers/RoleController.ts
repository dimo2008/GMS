import { Request, Response, Router } from 'express';
import { RoleService } from '../services/RoleService';

export class RoleController {
    private service: RoleService;

    constructor() {
        this.service = new RoleService();
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const role = await this.service.createRole(req.body);
            res.status(201).json(role);
        } catch (err: any) {
            res.status(400).json({ message: err.message || 'Error creating role' });
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const roles = await this.service.getAllRoles();
            res.json(roles);
        } catch (err: any) {
            res.status(500).json({ message: err.message || 'Error retrieving roles' });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const role = await this.service.getRoleById(req.params.id);
            if (role) res.json(role);
            else res.status(404).json({ message: 'Role not found' });
        } catch (err: any) {
            res.status(500).json({ message: err.message || 'Error retrieving role' });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const role = await this.service.updateRole(req.params.id, req.body);
            if (role) res.json(role);
            else res.status(404).json({ message: 'Role not found' });
        } catch (err: any) {
            res.status(400).json({ message: err.message || 'Error updating role' });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            await this.service.deleteRole(req.params.id);
            res.status(204).send();
        } catch (err: any) {
            res.status(500).json({ message: err.message || 'Error deleting role' });
        }
    }
}

export const RoleRouter = (() => {
    const controller = new RoleController();
    const router = Router();

    /**
     * @swagger
     * /api/roles:
     *   post:
     *     summary: Create a new role
     *     tags: [Roles]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *     responses:
     *       201:
     *         description: Role created
     */
    router.post('/', (req, res) => controller.create(req, res));

    /**
     * @swagger
     * /api/roles:
     *   get:
     *     summary: Get all roles
     *     tags: [Roles]
     *     responses:
     *       200:
     *         description: List of roles
     */
    router.get('/', (req, res) => controller.getAll(req, res));

    router.get('/:id', (req, res) => controller.getById(req, res));
    router.put('/:id', (req, res) => controller.update(req, res));
    router.delete('/:id', (req, res) => controller.delete(req, res));

    return router;
})();
