import { InventoryService } from "../services/inventory.service.ts";
import type { Response, Request } from "express";

class InventoryController {
    /**
     *
     * @param inventoryService - Inject of InventoryService dependency
     * allowing better testing in the future.
     */
    constructor(private inventoryService: InventoryService = new InventoryService()) {
        this.findAllInventoryEntries = this.findAllInventoryEntries.bind(this);
        this.findOneInventoryEntry = this.findOneInventoryEntry.bind(this);
        this.createInventoryEntry = this.createInventoryEntry.bind(this);
        this.updateInventoryEntry = this.updateInventoryEntry.bind(this);
        this.deleteInventoryEntry = this.deleteInventoryEntry.bind(this);
        this.restoreInventoryEntry = this.restoreInventoryEntry.bind(this);
    }

    /**
     * Method that creates a new inventory entry and then returns it.
     */
    createInventoryEntry = async (req: Request, res: Response): Promise<void> => {
        try {
            const inventoryEntry = await this.inventoryService.create(req.body);
            res.status(201).json(inventoryEntry);
        } catch (error) {
            this.handleError(res, error, 400, "Unexpected error creating inventory entry");
        }
    };

    /**
     * Method that returns all the inventory entries in the database.
     */
    findAllInventoryEntries = async (_req: Request, res: Response): Promise<void> => {
        try {
            const inventoryEntries = await this.inventoryService.findAll();
            res.status(200).json(inventoryEntries);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that returns an inventory entry by its ID.
     */
    findOneInventoryEntry = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const inventoryEntry = await this.inventoryService.findOne(id);
            res.status(200).json(inventoryEntry);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that allows updating an inventory entry and then returns it.
     */
    updateInventoryEntry = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const inventoryUpdated = await this.inventoryService.update(id, req.body);
            res.status(200).json(inventoryUpdated);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that deletes an inventory entry using soft-delete.
     */
    deleteInventoryEntry = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const inventoryDeleted = await this.inventoryService.delete(id);
            res.status(200).json({ inventoryDeleted });
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that restores a deleted inventory entry.
     */
    restoreInventoryEntry = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const inventoryRestored = await this.inventoryService.restore(id);
            res.status(200).json(inventoryRestored);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Helper that validates an ID.
     */
    private validateId(id: unknown, res: Response): number | null {
        const parsedId = Number(id);

        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            res.status(400).json({
                error: "Invalid or missing inventory entry ID"
            });
            return null;
        }

        return parsedId;
    }

    /**
     * Helper that handles service errors.
     */
    private handleError(
        res: Response,
        error: unknown,
        defaultStatus: number,
        defaultMsg = "An unexpected error occurred"
    ) {
        if (
            error &&
            typeof error === "object" &&
            "name" in error &&
            (error as { name: unknown }).name === "SequelizeUniqueConstraintError"
        ) {
            res.status(409).json({ error: "An inventory entry for this warehouse and medication already exists" });
            return;
        }

        const message = error instanceof Error ? error.message : defaultMsg;
        const status = message.toLowerCase().includes("not found")
            ? 404
            : defaultStatus;

        res.status(status).json({ error: message });
    }
}

export const inventoryController = new InventoryController();
