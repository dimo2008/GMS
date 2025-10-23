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
exports.MemberRouter = exports.MemberController = void 0;
const express_1 = require("express");
const MemberService_1 = require("../services/MemberService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserService_1 = require("../services/UserService");
// JWT auth middleware
function jwtAuth(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Missing or invalid Authorization header" });
    }
    const token = authHeader.slice(7);
    try {
        const secret = process.env.JWT_SECRET || "CHANGE_ME_TO_SECRET_IN_PROD";
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
class MemberController {
    constructor() {
        this.service = new MemberService_1.MemberService();
        this.userService = new UserService_1.UserService();
    }
    /**
     * @swagger
     * /api/members:
     *   post:
     *     summary: Create a new member
     *     tags: [Members]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Member'
     *     responses:
     *       201:
     *         description: Member created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Member'
     */
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            //check logged in user
            //check if the user has role admin
            const userId = req.user.sub;
            const user = yield this.userService.getUserById(userId);
            if (!user || !((_a = user.roles) === null || _a === void 0 ? void 0 : _a.some((r) => r.name === "admin"))) {
                res.status(403).json({ message: "Unauthorized" });
                return;
            }
            try {
                const member = yield this.service.createMember(req.body);
                res.status(201).json(member);
            }
            catch (error) {
                res.status(500).json({ message: "Error creating member", error });
            }
        });
    }
    /**
     * @swagger
     * /api/members:
     *   get:
     *     summary: Get all members
     *     tags: [Members]
     *     responses:
     *       200:
     *         description: List of all members
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Member'
     */
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const members = yield this.service.getAllMembers();
                res.json(members);
            }
            catch (error) {
                res.status(500).json({ message: "Error retrieving members", error });
            }
        });
    }
    /**
     * @swagger
     * /api/members/{id}:
     *   get:
     *     summary: Get a member by ID
     *     tags: [Members]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Member found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Member'
     *       404:
     *         description: Member not found
     */
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const member = yield this.service.getMemberById(req.params.id);
                if (member) {
                    res.json(member);
                }
                else {
                    res.status(404).json({ message: "Member not found" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Error retrieving member", error });
            }
        });
    }
    /**
     * @swagger
     * /api/members/{id}:
     *   put:
     *     summary: Update a member
     *     tags: [Members]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Member'
     *     responses:
     *       200:
     *         description: Member updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Member'
     *       404:
     *         description: Member not found
     */
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const member = yield this.service.updateMember(req.params.id, req.body);
                if (member) {
                    res.json(member);
                }
                else {
                    res.status(404).json({ message: "Member not found" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Error updating member", error });
            }
        });
    }
    /**
     * @swagger
     * /api/members/{id}:
     *   delete:
     *     summary: Delete a member
     *     tags: [Members]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       204:
     *         description: Member deleted successfully
     *       404:
     *         description: Member not found
     */
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.deleteMember(req.params.id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ message: "Error deleting member", error });
            }
        });
    }
}
exports.MemberController = MemberController;
// Export an Express Router that wires the controller methods to routes
exports.MemberRouter = (() => {
    const controller = new MemberController();
    const router = (0, express_1.Router)();
    // Require JWT for creating a member
    router.post("/", jwtAuth, (req, res) => controller.create(req, res));
    router.get("/", (req, res) => controller.getAll(req, res));
    router.get("/:id", (req, res) => controller.getById(req, res));
    router.put("/:id", (req, res) => controller.update(req, res));
    router.delete("/:id", (req, res) => controller.delete(req, res));
    return router;
})();
