import type { Request, Response } from "express";
import { WarehouseService } from "../services/warehouse.service.ts";
import type {
    WarehouseCreationDto,
    WarehouseUpdateDto
} from "../dto/warehouse.dto.ts"

const warehouseService = new WarehouseService();

/**
 * Controller class handling HTTP requests related to warehouses.
 */
export class WarehouseController {

    /**
     * Handles creation of a new warehouse.
     *
     * @param {Request} req - Express request object containing warehouse data in body.
     * @param {Response} res - Express response object.
     */
    async create(req: Request, res: Response): Promise<void> {
        try {
            const data: WarehouseCreationDto = req.body;
            const newWarehouse = await warehouseService.create(data);
            res.status(201).json(newWarehouse);
        } catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : "Failed to create warehouse"
            });
        }
    }

    /**
     * Retrieves all active warehouses.
     *
     * @param {Request} _req - Express request object.
     * @param {Response} res - Express response object.
     */
    async findAll(_req: Request, res: Response): Promise<void> {
        try {
            const warehouses = await warehouseService.findAll();
            res.status(200).json(warehouses);
        } catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Failed to retrieve warehouses"
            });
        }
    }

    /**
     * Retrieves a single warehouse by its ID.
     *
     * @param {Request} req - Express request object with ID parameter.
     * @param {Response} res - Express response object.
     */
    async findOne(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                res.status(400).json({ error: "Invalid warehouse ID" });
                return;
            }

            const warehouse = await warehouseService.findOne(id);
            res.status(200).json(warehouse);
        } catch (error) {
            res.status(404).json({
                error: error instanceof Error ? error.message : "Warehouse not found"
            });
        }
    }

    /**
     * Updates an existing warehouse by ID.
     *
     * @param {Request} req - Express request object with ID parameter and update body.
     * @param {Response} res - Express response object.
     */
    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                res.status(400).json({ error: "Invalid warehouse ID" });
                return;
            }

            const data: WarehouseUpdateDto = req.body;
            const updatedWarehouse = await warehouseService.update(id, data);
            res.status(200).json(updatedWarehouse);
        } catch (error) {
            res.status(400).json({
                error: error instanceof Error ? error.message : "Failed to update warehouse"
            });
        }
    }

    /**
     * Soft-deletes a warehouse by its ID.
     *
     * @param {Request} req - Express request object with ID parameter.
     * @param {Response} res - Express response object.
     */
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                res.status(400).json({ error: "Invalid warehouse ID" });
                return;
            }

            await warehouseService.delete(id);
            res.status(200).json({ message: "Warehouse successfully deactivated" });
        } catch (error) {
            res.status(404).json({
                error: error instanceof Error ? error.message : "Failed to delete warehouse"
            });
        }
    }

    /**
     * Restores a soft-deleted warehouse.
     *
     * @param {Request} req - Express request object with ID parameter.
     * @param {Response} res - Express response object.
     */
    async restore(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (!Number.isInteger(id) || id <= 0) {
                res.status(400).json({ error: "Invalid warehouse ID" });
                return;
            }

            const restoredWarehouse = await warehouseService.restore(id);
            res.status(200).json(restoredWarehouse);
        } catch (error) {
            res.status(404).json({
                error: error instanceof Error ? error.message : "Failed to restore warehouse"
            });
        }
    }
}