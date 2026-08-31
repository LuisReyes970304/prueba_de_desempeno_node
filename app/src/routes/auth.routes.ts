import { Router } from "express";
import { authController } from "../controllers/auth.controller.ts";

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login
 *     description: Authenticate a user with email and password. Returns a JWT token plus the public user data.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: luisreyescaro@gmail.com
 *               password:
 *                 type: string
 *                 example: LuisDev2026!
 *     responses:
 *       200:
 *         description: Login successful, returns the JWT token and user info.
 *       400:
 *         description: Missing email or password.
 *       401:
 *         description: Invalid credentials.
 */
router.post("/login", authController.login);

export default router;
