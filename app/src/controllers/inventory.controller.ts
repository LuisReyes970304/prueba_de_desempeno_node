import { InventoryService } from "../services/inventory.service.ts";
import type { Response, Request } from "express";
import { BaseController } from "./base.controller.ts";

class InventoryController extends BaseController {
    /**
     *
     * @param inventoryService - Inject of InventoryService dependency
     * allowing better testing in the future.
     */
    constructor(private inventoryService: InventoryService = new InventoryService()) {
        super();
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
            this.handleError(res, error, 400, {
                defaultMsg: "Unexpected error creating inventory entry",
                uniqueConstraintMessage: "An inventory entry for this warehouse and medication already exists",
            });
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
            const id = this.validateId(req.params.id, res, "inventory entry ID");
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
            const id = this.validateId(req.params.id, res, "inventory entry ID");
            if (id === null) return;

            const inventoryUpdated = await this.inventoryService.update(id, req.body);
            res.status(200).json(inventoryUpdated);
        } catch (error) {
            this.handleError(res, error, 500, {
                uniqueConstraintMessage: "An inventory entry for this warehouse and medication already exists",
            });
        }
    };

    /**
     * Method that deletes an inventory entry using soft-delete.
     */
    deleteInventoryEntry = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res, "inventory entry ID");
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
            const id = this.validateId(req.params.id, res, "inventory entry ID");
            if (id === null) return;

            const inventoryRestored = await this.inventoryService.restore(id);
            res.status(200).json(inventoryRestored);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };
}

export const inventoryController = new InventoryController();
