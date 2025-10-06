import { Request, Response } from "express";
import { MemberService } from "../services/MemberService";

export class MemberController {
    private service: MemberService;

    constructor() {
        this.service = new MemberService();
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
    async create(req: Request, res: Response): Promise<void> {
        try {
            const member = await this.service.createMember(req.body);
            res.status(201).json(member);
        } catch (error) {
            res.status(500).json({ message: "Error creating member", error });
        }
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
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const members = await this.service.getAllMembers();
            res.json(members);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving members", error });
        }
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
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const member = await this.service.getMemberById(req.params.id);
            if (member) {
                res.json(member);
            } else {
                res.status(404).json({ message: "Member not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error retrieving member", error });
        }
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
    async update(req: Request, res: Response): Promise<void> {
        try {
            const member = await this.service.updateMember(req.params.id, req.body);
            if (member) {
                res.json(member);
            } else {
                res.status(404).json({ message: "Member not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error updating member", error });
        }
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
    async delete(req: Request, res: Response): Promise<void> {
        try {
            await this.service.deleteMember(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: "Error deleting member", error });
        }
    }
}