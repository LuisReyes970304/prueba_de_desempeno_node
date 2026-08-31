import { Router } from "express";
import { userController } from "../controllers/user.controller.ts";
import { authorizeRoles, verifyToken } from "../middleware/auth.middleware.ts";

const router = Router();

/**
 * @openapi
 * /user/create_user:
 *   post:
 *     summary: Create new user!
 *     description: Create a new user using a body request.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Luis Reyes
 *               email: 
 *                 type: string
 *                 example: luisreyes@gmail.com
 *               password:
 *                 type: string
 *                 example: new_password_123
 *     responses:
 *       201:
 *         description: New user created.
 */
router.post("/create_user", userController.createUser);

/**
 * @openapi
 * /user/get_users:
 *   get:
 *     summary: Get all users!
 *     description: Get all users in the database in a json file
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: database returned successfully.
 */
router.get("/get_users", verifyToken, authorizeRoles("admin"), userController.findAllUsers);

/**
 * @openapi
 * /user/update_user/{id}:
 *   patch:
 *     summary: Update user
 *     description: Update an existing user's details using the request body.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Luis Reyes updated
 *               password:
 *                 type: string
 *                 example: password_updated
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Invalid user ID or request body.
 *       404:
 *         description: User not found.
 */
router.patch("/update_user/:id", userController.updateUser);

/**
 * @openapi
 * /user/delete/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Soft-delete an existing user using their ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       400:
 *         description: Invalid or missing user ID.
 *       404:
 *         description: User not found.
 */
router.delete("/delete/:id", verifyToken, authorizeRoles("admin"),userController.deleteUser);

/**
 * @openapi
 * /user/restore/{id}:
 *   patch:
 *     summary: Restore user by ID
 *     description: Restore a soft-deleted user using their ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to restore.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: User restored successfully.
 *       400:
 *         description: Invalid or missing user ID.
 *       404:
 *         description: User not found.
 */
router.patch("/restore/:id", verifyToken, authorizeRoles("admin"),userController.restoreUser);

export default router;
