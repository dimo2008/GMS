import { Request, Response, Router, NextFunction } from "express";
import { MemberService } from "../services/MemberService";
import { Member } from "../models/Member";
import jwt from "jsonwebtoken";
import { UserService } from "../services/UserService";

// JWT auth middleware
function jwtAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Missing or invalid Authorization header" });
  }
  const token = authHeader.slice(7);
  try {
    const secret = process.env.JWT_SECRET || "CHANGE_ME_TO_SECRET_IN_PROD";
    const payload = jwt.verify(token, secret);
    (req as any).user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export class MemberController {
  private service: MemberService;
  private userService: UserService;
  constructor() {
    this.service = new MemberService();
    this.userService = new UserService();
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
    //check logged in user
    //check if the user has role admin
    // const userId = (req as any).user.sub;

    // const user = await this.userService.getUserById(userId);
    // if (!user || !user.roles?.some((r) => r.name === "admin")) {
    //   res.status(403).json({ message: "Unauthorized" });
    //   return;
    // }

    try {
      console.log(req.body);

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
      console.log(req.query.id);
      const id = (req.query.id as string) ?? "";
      if (!id) {
        const members = await this.service.getAllMembers();
        res.json(members);
      } else {
        const member = await this.service.getMemberById(id);
        const members: Member[] = member ? [member] : [];
        res.json(members);
      }
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

// Export an Express Router that wires the controller methods to routes
export const MemberRouter = (() => {
  const controller = new MemberController();
  const router = Router();

  // Require JWT for creating a member
  router.post("/", (req, res) => controller.create(req, res));
  router.get("/", (req, res) => controller.getAll(req, res));
  router.get("/:id", (req, res) => controller.getById(req, res));
  router.put("/:id", (req, res) => controller.update(req, res));
  router.delete("/:id", (req, res) => controller.delete(req, res));

  return router;
})();
