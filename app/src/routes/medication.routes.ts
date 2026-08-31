import { Router } from "express";
import { medicationController } from "../controllers/medication.controller.ts";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.ts";
import { validateMedicationNameOnCreate, validateMedicationNameOnUpdate } from "../middleware/medication.middleware.ts";

const router = Router();

/**
 * @openapi
 * /medication:
 *   post:
 *     summary: Create a medication
 *     description: Creates a new medication in the catalog. Only admin users can perform this action.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Medications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - unit
 *             properties:
 *               name:
 *                 type: string
 *                 example: Amoxicillin 500mg
 *               description:
 *                 type: string
 *                 example: Broad-spectrum antibiotic, capsule presentation
 *               unit:
 *                 type: string
 *                 example: box
 *     responses:
 *       201:
 *         description: Medication created successfully.
 *       400:
 *         description: Invalid body parameters.
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin role.
 *       409:
 *         description: A medication with this name already exists.
 */
router.post(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    validateMedicationNameOnCreate,
    medicationController.createMedication
);

/**
 * @openapi
 * /medication:
 *   get:
 *     summary: List all medications
 *     description: Retrieves a list of all active medications. All authenticated users can access this.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Medications
 *     responses:
 *       200:
 *         description: List of medications returned successfully.
 *       401:
 *         description: Token not found or invalid.
 */
router.get("/", verifyToken, medicationController.findAllMedications);

/**
 * @openapi
 * /medication/{id}:
 *   get:
 *     summary: Get a medication by ID
 *     description: Retrieves details of a specific active medication based on its ID. All authenticated users can access this.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Medications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the medication to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Medication found successfully.
 *       400:
 *         description: Invalid medication ID format.
 *       401:
 *         description: Token not found or invalid.
 *       404:
 *         description: Medication not found.
 */
router.get("/:id", verifyToken, medicationController.findOneMedication);

/**
 * @openapi
 * /medication/{id}:
 *   patch:
 *     summary: Update a medication
 *     description: Updates an existing medication. Only admin users can perform this action.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Medications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the medication to update.
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
 *                 example: Amoxicillin 500mg
 *               description:
 *                 type: string
 *                 example: Broad-spectrum antibiotic, capsule presentation
 *               unit:
 *                 type: string
 *                 example: box
 *     responses:
 *       200:
 *         description: Medication updated successfully.
 *       400:
 *         description: Invalid body parameters or ID format.
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin role.
 *       404:
 *         description: Medication not found.
 *       409:
 *         description: The name belongs to another existing medication.
 */
router.patch(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    validateMedicationNameOnUpdate,
    medicationController.updateMedication
);

/**
 * @openapi
 * /medication/{id}:
 *   delete:
 *     summary: Soft delete a medication
 *     description: Performs a logical deletion (soft-delete) of a medication. Only admin users can perform this action.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Medications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the medication to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Medication successfully soft-deleted.
 *       400:
 *         description: Invalid medication ID format.
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin role.
 *       404:
 *         description: Medication not found.
 */
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    medicationController.deleteMedication
);

/**
 * @openapi
 * /medication/{id}/restore:
 *   patch:
 *     summary: Restore a deleted medication
 *     description: Restores a previously soft-deleted medication. Only admin users can perform this action.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Medications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the medication to restore.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Medication restored successfully.
 *       400:
 *         description: Invalid medication ID format.
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin role.
 *       404:
 *         description: Medication not found.
 */
router.patch(
    "/:id/restore",
    verifyToken,
    authorizeRoles("admin"),
    medicationController.restoreMedication
);

export default router;
