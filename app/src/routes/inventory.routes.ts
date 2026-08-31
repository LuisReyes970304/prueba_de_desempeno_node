import { Router } from "express";
import { inventoryController } from "../controllers/inventory.controller.ts";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.ts";
import { validateInventoryOnCreate, validateInventoryOnUpdate } from "../middleware/inventory.middleware.ts";

const router = Router();

/**
 * @openapi
 * /inventory:
 *   post:
 *     summary: Create an inventory entry
 *     description: Registers the stock of a medication in a specific warehouse. Only admin users can perform this action. Validates that both the warehouse and the medication exist, and that no entry already exists for that exact pair.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inventory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - warehouseId
 *               - medicationId
 *               - quantity
 *             properties:
 *               warehouseId:
 *                 type: integer
 *                 example: 1
 *               medicationId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 500
 *     responses:
 *       201:
 *         description: Inventory entry created successfully.
 *       400:
 *         description: Invalid body parameters.
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin role.
 *       404:
 *         description: Warehouse or medication not found.
 *       409:
 *         description: An inventory entry for this warehouse and medication already exists.
 */
router.post(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    validateInventoryOnCreate,
    inventoryController.createInventoryEntry
);

/**
 * @openapi
 * /inventory:
 *   get:
 *     summary: List all inventory entries
 *     description: Retrieves a list of all active inventory entries, including their related warehouse and medication. All authenticated users can access this.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inventory
 *     responses:
 *       200:
 *         description: List of inventory entries returned successfully.
 *       401:
 *         description: Token not found or invalid.
 */
router.get("/", verifyToken, inventoryController.findAllInventoryEntries);

/**
 * @openapi
 * /inventory/{id}:
 *   get:
 *     summary: Get an inventory entry by ID
 *     description: Retrieves details of a specific active inventory entry based on its ID. All authenticated users can access this.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inventory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the inventory entry to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Inventory entry found successfully.
 *       400:
 *         description: Invalid inventory entry ID format.
 *       401:
 *         description: Token not found or invalid.
 *       404:
 *         description: Inventory entry not found.
 */
router.get("/:id", verifyToken, inventoryController.findOneInventoryEntry);

/**
 * @openapi
 * /inventory/{id}:
 *   patch:
 *     summary: Update an inventory entry
 *     description: Updates the stock quantity or the warehouse/medication pair of an existing inventory entry. Only admin users can perform this action.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inventory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the inventory entry to update.
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
 *               warehouseId:
 *                 type: integer
 *                 example: 1
 *               medicationId:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 350
 *     responses:
 *       200:
 *         description: Inventory entry updated successfully.
 *       400:
 *         description: Invalid body parameters or ID format.
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin role.
 *       404:
 *         description: Inventory entry, warehouse or medication not found.
 *       409:
 *         description: Another inventory entry for this warehouse and medication already exists.
 */
router.patch(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    validateInventoryOnUpdate,
    inventoryController.updateInventoryEntry
);

/**
 * @openapi
 * /inventory/{id}:
 *   delete:
 *     summary: Soft delete an inventory entry
 *     description: Performs a logical deletion (soft-delete) of an inventory entry. Only admin users can perform this action.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inventory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the inventory entry to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Inventory entry successfully soft-deleted.
 *       400:
 *         description: Invalid inventory entry ID format.
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin role.
 *       404:
 *         description: Inventory entry not found.
 */
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    inventoryController.deleteInventoryEntry
);

/**
 * @openapi
 * /inventory/{id}/restore:
 *   patch:
 *     summary: Restore a deleted inventory entry
 *     description: Restores a previously soft-deleted inventory entry. Only admin users can perform this action.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inventory
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the inventory entry to restore.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Inventory entry restored successfully.
 *       400:
 *         description: Invalid inventory entry ID format.
 *       401:
 *         description: Token not found or invalid.
 *       403:
 *         description: User does not have admin role.
 *       404:
 *         description: Inventory entry not found.
 */
router.patch(
    "/:id/restore",
    verifyToken,
    authorizeRoles("admin"),
    inventoryController.restoreInventoryEntry
);

export default router;
