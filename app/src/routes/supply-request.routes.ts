import { Router } from "express";
import { supplyRequestController } from "../controllers/supply-request.controller.ts";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.ts";
import { validateSupplyRequestOnCreate, validateStatusUpdate } from "../middleware/supply-request.middleware.ts";

const router = Router();

/**
 * @openapi
 * /requests:
 *   post:
 *     summary: Create a supply request
 *     description: >
 *       Registers a new medication supply request for a clinic. Status always starts
 *       as "pending" and can only change through the status-update endpoint.
 *       Both "admin" and "manager" users can perform this action. Validates that the
 *       clinic, medication and warehouse exist, that the quantity is a positive
 *       integer, and that the warehouse holds enough stock of that medication.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Supply Requests
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clinicId
 *               - medicationId
 *               - warehouseId
 *               - quantity
 *             properties:
 *               clinicId:
 *                 type: integer
 *                 example: 1
 *               medicationId:
 *                 type: integer
 *                 example: 1
 *               warehouseId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       201:
 *         description: Supply request created successfully, with status "pending".
 *       400:
 *         description: Invalid body parameters (including quantity <= 0).
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin or manager role.
 *       404:
 *         description: Clinic, medication or warehouse not found.
 *       409:
 *         description: Insufficient inventory for the requested quantity.
 */
router.post(
    "/",
    verifyToken,
    authorizeRoles("admin", "manager"),
    validateSupplyRequestOnCreate,
    supplyRequestController.createSupplyRequest
);

/**
 * @openapi
 * /requests:
 *   get:
 *     summary: List active supply requests
 *     description: Retrieves all active (non soft-deleted) supply requests. All authenticated users can access this.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Supply Requests
 *     responses:
 *       200:
 *         description: List of active supply requests returned successfully.
 *       401:
 *         description: Token not found or invalid.
 */
router.get("/", verifyToken, supplyRequestController.findActiveSupplyRequests);

/**
 * @openapi
 * /requests/history:
 *   get:
 *     summary: Full supply request history
 *     description: Retrieves every supply request ever registered, including soft-deleted ones, for full traceability. All authenticated users can access this.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Supply Requests
 *     responses:
 *       200:
 *         description: Full supply request history returned successfully.
 *       401:
 *         description: Token not found or invalid.
 */
router.get("/history", verifyToken, supplyRequestController.findSupplyRequestHistory);

/**
 * @openapi
 * /requests/clinic/{clinicId}:
 *   get:
 *     summary: Supply request history for a clinic
 *     description: Retrieves the full history of supply requests made by a single clinic, including soft-deleted ones. All authenticated users can access this.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Supply Requests
 *     parameters:
 *       - in: path
 *         name: clinicId
 *         required: true
 *         description: ID of the clinic.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Supply request history for the clinic returned successfully.
 *       400:
 *         description: Invalid clinic ID format.
 *       401:
 *         description: Token not found or invalid.
 */
router.get("/clinic/:clinicId", verifyToken, supplyRequestController.findSupplyRequestsByClinic);

/**
 * @openapi
 * /requests/{id}:
 *   get:
 *     summary: Get a supply request by ID
 *     description: Retrieves details of a specific active supply request. All authenticated users can access this.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Supply Requests
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the supply request.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Supply request found successfully.
 *       400:
 *         description: Invalid supply request ID format.
 *       401:
 *         description: Token not found or invalid.
 *       404:
 *         description: Supply request not found.
 */
router.get("/:id", verifyToken, supplyRequestController.findOneSupplyRequest);

/**
 * @openapi
 * /requests/{id}/status:
 *   patch:
 *     summary: Update the status of a supply request
 *     description: >
 *       Updates the workflow status of an existing supply request. Both "admin" and
 *       "manager" users can perform this action. Validates that the target status
 *       is one of the allowed values.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Supply Requests
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the supply request to update.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, delivered, cancelled]
 *                 example: approved
 *     responses:
 *       200:
 *         description: Supply request status updated successfully.
 *       400:
 *         description: Invalid status value or ID format.
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin or manager role.
 *       404:
 *         description: Supply request not found.
 */
router.patch(
    "/:id/status",
    verifyToken,
    authorizeRoles("admin", "manager"),
    validateStatusUpdate,
    supplyRequestController.updateSupplyRequestStatus
);

/**
 * @openapi
 * /requests/{id}:
 *   patch:
 *     summary: Update a supply request
 *     description: Updates the clinic, medication, warehouse or quantity of an existing supply request. Only admin users can perform this action.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Supply Requests
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the supply request to update.
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
 *               clinicId:
 *                 type: integer
 *                 example: 1
 *               medicationId:
 *                 type: integer
 *                 example: 1
 *               warehouseId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 75
 *     responses:
 *       200:
 *         description: Supply request updated successfully.
 *       400:
 *         description: Invalid body parameters or ID format.
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin role.
 *       404:
 *         description: Supply request not found.
 */
router.patch(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    supplyRequestController.updateSupplyRequest
);

/**
 * @openapi
 * /requests/{id}:
 *   delete:
 *     summary: Soft delete a supply request
 *     description: Performs a logical deletion (soft-delete) of a supply request. Only admin users can perform this action.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Supply Requests
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the supply request to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Supply request successfully soft-deleted.
 *       400:
 *         description: Invalid supply request ID format.
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin role.
 *       404:
 *         description: Supply request not found.
 */
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    supplyRequestController.deleteSupplyRequest
);

/**
 * @openapi
 * /requests/{id}/restore:
 *   patch:
 *     summary: Restore a deleted supply request
 *     description: Restores a previously soft-deleted supply request. Only admin users can perform this action.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Supply Requests
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the supply request to restore.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Supply request restored successfully.
 *       400:
 *         description: Invalid supply request ID format.
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin role.
 *       404:
 *         description: Supply request not found.
 */
router.patch(
    "/:id/restore",
    verifyToken,
    authorizeRoles("admin"),
    supplyRequestController.restoreSupplyRequest
);

export default router;
