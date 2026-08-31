import { Router } from "express";
import { seedController } from "../controllers/seed.controller.ts";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.ts";
import { uploadJsonFile } from "../middleware/upload.middleware.ts";

const router = Router();

/**
 * @openapi
 * /seed/upload:
 *   post:
 *     summary: Seed the database from a JSON file
 *     description: >
 *       Uploads a JSON file (via multipart/form-data, field name "file") and uses its
 *       content to populate the database. The file may contain any combination of the
 *       "users", "clinics", "warehouses" and "medications" sections. Seeding is
 *       idempotent: rows that already exist (matched by a natural unique key) are
 *       skipped instead of duplicated, and a single invalid row does not abort the
 *       rest of the batch. Only admin users can perform this action.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Seed
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: JSON file with users/clinics/warehouses/medications arrays.
 *     responses:
 *       200:
 *         description: Seed file processed. Returns a per-entity summary of created/skipped rows and row-level errors.
 *       400:
 *         description: No file uploaded, invalid JSON, or the file does not contain any recognized section.
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin role.
 */
router.post(
    "/upload",
    verifyToken,
    authorizeRoles("admin"),
    uploadJsonFile,
    seedController.uploadSeedFile
);

export default router;
