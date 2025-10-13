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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = exports.UserController = void 0;
const express_1 = require("express");
const UserService_1 = require("../services/UserService");
class UserController {
    constructor() {
        this.service = new UserService_1.UserService();
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.service.createUser(req.body);
                res.status(201).json(user);
            }
            catch (error) {
                res.status(500).json({ message: error.message || 'Error creating user', error });
            }
        });
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
     *     responses:
     *       201:
     *         description: User created
     */
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.service.getAllUsers();
                res.json(users);
            }
            catch (error) {
                res.status(500).json({ message: error.message || 'Error retrieving users', error });
            }
        });
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
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.service.getUserById(req.params.id);
                if (user)
                    res.json(user);
                else
                    res.status(404).json({ message: 'User not found' });
            }
            catch (error) {
                res.status(500).json({ message: error.message || 'Error retrieving user', error });
            }
        });
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
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.service.updateUser(req.params.id, req.body);
                if (user)
                    res.json(user);
                else
                    res.status(404).json({ message: 'User not found' });
            }
            catch (error) {
                res.status(500).json({ message: error.message || 'Error updating user', error });
            }
        });
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
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.deleteUser(req.params.id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ message: error.message || 'Error deleting user', error });
            }
        });
    }
}
exports.UserController = UserController;
exports.UserRouter = (() => {
    const controller = new UserController();
    const router = (0, express_1.Router)();
    router.post('/', (req, res) => controller.create(req, res));
    router.get('/', (req, res) => controller.getAll(req, res));
    router.get('/:id', (req, res) => controller.getById(req, res));
    router.put('/:id', (req, res) => controller.update(req, res));
    router.delete('/:id', (req, res) => controller.delete(req, res));
    return router;
})();
