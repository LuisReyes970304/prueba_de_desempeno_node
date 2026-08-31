import { Router } from "express";
import { warehouseController } from "../controllers/warehouse.controller.ts";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.ts";
import { validateWarehouseNameOnCreate, validateWarehouseNameOnUpdate } from "../middleware/warehouse.middleware.ts";

const router = Router();

/**
 * @openapi
 * /warehouse:
 *   post:
 *     summary: Create a warehouse
 *     description: Creates a new warehouse. Only admin users can perform this action.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Warehouses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: Main Warehouse
 *               location:
 *                 type: string
 *                 example: 123 Logistics Avenue, Barranquilla
 *               phone:
 *                 type: integer
 *                 example: 3001234567
 *     responses:
 *       201:
 *         description: Warehouse created successfully.
 *       400:
 *         description: Invalid body parameters.
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin role.
 *       409:
 *         description: A warehouse with this name already exists.
 */
router.post(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    validateWarehouseNameOnCreate,
    warehouseController.createWarehouse
);

/**
 * @openapi
 * /warehouse:
 *   get:
 *     summary: List all warehouses
 *     description: Retrieves a list of all active warehouses. All authenticated users can access this.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Warehouses
 *     responses:
 *       200:
 *         description: List of warehouses returned successfully.
 *       401:
 *         description: Token not found or invalid.
 */
router.get(
    "/",
    verifyToken,
    warehouseController.findAllWarehouses
);

/**
 * @openapi
 * /warehouse/{id}:
 *   get:
 *     summary: Get a warehouse by ID
 *     description: Retrieves details of a specific warehouse based on its ID.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Warehouses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the warehouse to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Warehouse found successfully.
 *       400:
 *         description: Invalid warehouse ID format.
 *       401:
 *         description: Token not found or invalid.
 *       404:
 *         description: Warehouse not found.
 */
router.get(
    "/:id",
    verifyToken,
    warehouseController.findOneWarehouse
);

/**
 * @openapi
 * /warehouse/{id}:
 *   patch:
 *     summary: Update a warehouse
 *     description: Updates an existing warehouse. Only admin users can perform this action.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Warehouses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the warehouse to update.
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
 *                 example: Secondary Warehouse
 *               location:
 *                 type: string
 *                 example: 456 Storage Road, Bogota
 *               phone:
 *                 type: integer
 *                 example: 3109876543
 *     responses:
 *       200:
 *         description: Warehouse updated successfully.
 *       400:
 *         description: Invalid body parameters or ID format.
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin role.
 *       404:
 *         description: Warehouse not found.
 *       409:
 *         description: The name belongs to another existing warehouse.
 */
router.patch(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    validateWarehouseNameOnUpdate,
    warehouseController.updateWarehouse
);

/**
 * @openapi
 * /warehouse/{id}:
 *   delete:
 *     summary: Soft delete a warehouse
 *     description: Performs a logical deletion (soft-delete) of a warehouse. Only admin users can perform this action.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Warehouses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the warehouse to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Warehouse successfully soft-deleted.
 *       400:
 *         description: Invalid warehouse ID format.
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin role.
 *       404:
 *         description: Warehouse not found.
 */
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    warehouseController.deleteWarehouse
);

/**
 * @openapi
 * /warehouse/{id}/restore:
 *   patch:
 *     summary: Restore a deleted warehouse
 *     description: Restores a previously soft-deleted warehouse. Only admin users can perform this action.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Warehouses
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the warehouse to restore.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Warehouse restored successfully.
 *       400:
 *         description: Invalid warehouse ID format.
 *       401:
 *         description: Token not found or invalid.
 *       404:
 *         description: Warehouse not found.
 */
router.patch(
    "/:id/restore",
    verifyToken,
    authorizeRoles("admin"),
    warehouseController.restoreWarehouse
);

export default router;