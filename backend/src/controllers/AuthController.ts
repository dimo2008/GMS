import { Router, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    async login(req: Request, res: Response) {
        try {
            const { identifier, password } = req.body;
            if (!identifier || !password) return res.status(400).json({ message: 'identifier and password are required' });
            const result = await this.service.authenticate(identifier, password);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ message: error.message || 'Authentication failed' });
        }
    }

    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: Log in a user and receive a JWT
     *     tags: [Auth]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               identifier:
     *                 type: string
     *                 description: Username or email
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: Authentication successful
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/AuthResponse'
     */
}

export const AuthRouter = (() => {
    const controller = new AuthController();
    const router = Router();
    router.post('/login', (req, res) => controller.login(req, res));
    return router;
})();
