import { WarehouseService } from "../services/warehouse.service.ts";
import type { Response, Request } from "express";

export class WarehouseController {
    /**
     * @param warehouseService - Injects the WarehouseService dependency allowing better testing in the future.
     */
    constructor(private warehouseService: WarehouseService = new WarehouseService()) {
        this.createWarehouse = this.createWarehouse.bind(this);
        this.findAllWarehouses = this.findAllWarehouses.bind(this);
        this.findOneWarehouse = this.findOneWarehouse.bind(this);
        this.updateWarehouse = this.updateWarehouse.bind(this);
        this.deleteWarehouse = this.deleteWarehouse.bind(this);
        this.restoreWarehouse = this.restoreWarehouse.bind(this);
    }

    /**
     * Method that creates a new warehouse and returns it.
     */
    createWarehouse = async (req: Request, res: Response): Promise<void> => {
        try {
            const warehouse = await this.warehouseService.create(req.body);
            res.status(201).json(warehouse);
        } catch (error) {
            this.handleError(res, error, 400, "Unexpected error creating warehouse");
        }
    };

    /**
     * Method that returns all active warehouses in the database.
     */
    findAllWarehouses = async (_req: Request, res: Response): Promise<void> => {
        try {
            const warehouses = await this.warehouseService.findAll();
            res.status(200).json(warehouses);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that finds a warehouse by its ID.
     */
    findOneWarehouse = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const warehouse = await this.warehouseService.findOne(id);
            res.status(200).json(warehouse);
        } catch (error) {
            this.handleError(res, error, 404, "Warehouse not found");
        }
    };

    /**
     * Method that updates an existing warehouse and returns the updated entity.
     */
    updateWarehouse = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const warehouseUpdated = await this.warehouseService.update(id, req.body);
            res.status(200).json(warehouseUpdated);
        } catch (error) {
            this.handleError(res, error, 400);
        }
    };

    /**
     * Method that performs a soft-delete on a warehouse.
     */
    deleteWarehouse = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const warehouseDeleted = await this.warehouseService.delete(id);
            res.status(200).json({ warehouseDeleted });
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that restores a soft-deleted warehouse.
     */
    restoreWarehouse = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const warehouseRestored = await this.warehouseService.restore(id);
            res.status(200).json(warehouseRestored);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * --- Helper method to validate the ID parameter ---
     */
    private validateId(id: unknown, res: Response): number | null {
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            res.status(400).json({
                error: "Invalid or missing warehouse ID"
            });
            return null;
        }
        return parsedId;
    }

    private handleError(res: Response, error: unknown, defaultStatus: number, defaultMsg = "An unexpected error occurred") {
        const message = error instanceof Error ? error.message : defaultMsg;
        const status = message.toLowerCase().includes("not found") ? 404 : defaultStatus;
        res.status(status).json({ error: message });
    }
}

export const warehouseController = new WarehouseController();