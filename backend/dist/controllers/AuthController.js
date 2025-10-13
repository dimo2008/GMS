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
exports.AuthRouter = exports.AuthController = void 0;
const express_1 = require("express");
const AuthService_1 = require("../services/AuthService");
class AuthController {
    constructor() {
        this.service = new AuthService_1.AuthService();
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { identifier, password } = req.body;
                if (!identifier || !password)
                    return res.status(400).json({ message: 'identifier and password are required' });
                const result = yield this.service.authenticate(identifier, password);
                res.json(result);
            }
            catch (error) {
                res.status(401).json({ message: error.message || 'Authentication failed' });
            }
        });
    }
}
exports.AuthController = AuthController;
exports.AuthRouter = (() => {
    const controller = new AuthController();
    const router = (0, express_1.Router)();
    router.post('/login', (req, res) => controller.login(req, res));
    return router;
})();
