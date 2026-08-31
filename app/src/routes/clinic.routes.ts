import { Router } from "express";
import { clinicController } from "../controllers/clinic.controller.ts";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.ts";
import { validateNitOnCreate, validateNitOnUpdate } from "../middleware/clinic.middleware.ts";

const router = Router();

/**
 * @openapi
 * /clinic:
 *   post:
 *     summary: Crear clínica
 *     description: create a new clinic, just admin can do it.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clinicas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - nit
 *               - phone
 *               - address
 *               - responsibleName
 *             properties:
 *               name:
 *                 type: string
 *                 example: Clínica Central
 *               nit:
 *                 type: integer
 *                 example: 900123456
 *               phone:
 *                 type: integer
 *                 example: 3025949098
 *               address:
 *                 type: string
 *                 example: Calle 45 # 12-30, Bogotá
 *               responsibleName:
 *                 type: string
 *                 example: Dra. María Fernanda Gómez
 *     responses:
 *       201:
 *         description: Clinic created successfully.
 *       400:
 *         description: invalid body.
 *       401:
 *         description: Token not found.
 *       403:
 *         description: The user has not rol admin.
 *       409:
 *         description: The clinic with this NIT already exists.
 */
router.post(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    validateNitOnCreate,
    clinicController.createClinic
);

/**
 * @openapi
 * /clinic:
 *   get:
 *     summary: LIst for all the clinics
 *     description: All user can get access to the list.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clinicas
 *     responses:
 *       200:
 *         description: Clinic list returned.
 *       401:
 *         description: TOken not found.
 */
router.get("/", verifyToken, clinicController.findAllClinics);

/**
 * @openapi
 * /clinic/{id}:
 *   get:
 *     summary: get clinic by ID
 *     description: found a clinc based on its ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clinicas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la clínica.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: CLinic found successfully.
 *       400:
 *         description: Invalid ID.
 *       401:
 *         description: Token not found.
 *       404:
 *         description: Clinic not found.
 */
router.get("/:id", verifyToken, clinicController.findOneClinic);

/**
 * @openapi
 * /clinic/{id}:
 *   patch:
 *     summary: Update clinic
 *     description: Just addmin can update the clinics
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clinicas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: clinic of ID to update.
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
 *                 example: Central clinic updated
 *               nit:
 *                 type: integer
 *                 example: 900987654
 *               phone:
 *                 type: integer
 *                 example: 3025949098
 *               address:
 *                 type: string
 *                 example: Carrera 10 # 20-15, Bogotá
 *               responsibleName:
 *                 type: string
 *                 example: Dr. Carlos Andrés Pérez
 *     responses:
 *       200:
 *         description: Clinic updated succesfully.
 *       400:
 *         description: body or id no found.
 *       401:
 *         description: Token not found.
 *       403:
 *         description: The user is not admin.
 *       404:
 *         description: Clinic not found.
 *       409:
 *         description: The NIT belong to another clinic.
 */
router.patch(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    validateNitOnUpdate,
    clinicController.updateClinic
);

/**
 * @openapi
 * /clinic/{id}:
 *   delete:
 *     summary: Soft delete 
 *     description: Delete the clinic using soft-delete
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clinicas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la clínica a eliminar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Clinic deleted (soft-delete).
 *       400:
 *         description: Invalid ID.
 *       401:
 *         description: Token not found.
 *       403:
 *         description: USer is not admin.
 *       404:
 *         description: Clinic not found.
 */
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    clinicController.deleteClinic
);

/**
 * @openapi
 * /clinic/{id}/restore:
 *   patch:
 *     summary: Restore deleted clinic
 *     description: Restore deleted clinic with soft delete
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clinicas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of clinit to restore.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Clinic restored succesfully.
 *       400:
 *         description: Invalid ID.
 *       401:
 *         description: Token not found.
 *       403:
 *         description: User is not admin.
 *       404:
 *         description: Clinic not found.
 */
router.patch(
    "/:id/restore",
    verifyToken,
    authorizeRoles("admin"),
    clinicController.restoreClinic
);

export default router;