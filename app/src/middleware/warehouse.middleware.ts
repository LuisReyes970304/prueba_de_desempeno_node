import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.middleware.ts";
import { WarehouseRepository } from "../repository/warehouse.repository.ts";

const warehouseRepository = new WarehouseRepository();

/**
 * Helper function that validates and normalizes the warehouse name received in the body.
 * Returns null (and sends a 400 response) if it is not a valid text string.
 */
function parseNameFromBody(body: unknown, res: Response): string | null {
    const name = (body as { name?: unknown })?.name;

    if (typeof name !== "string" || name.trim().length === 0) {
        res.status(400).json({ error: "Invalid or missing warehouse name" });
        return null;
    }

    return name.trim();
}

/**
 * Middleware for POST /api/almacenes.
 * Validates that the name sent in the body does not already exist in another warehouse
 * (active or soft-deleted) before attempting to create it.
 */
export const validateWarehouseNameOnCreate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const name = parseNameFromBody(req.body, res);
        if (name === null) return;

        const existingWarehouse = await warehouseRepository.findByName(name);
        if (existingWarehouse) {
            res.status(409).json({ error: "A warehouse with this name already exists" });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unexpected error validating warehouse name",
        });
    }
};

/**
 * Middleware for PUT /api/almacenes/:id.
 * If the body includes a name, it validates that it does not conflict with ANOTHER
 * existing warehouse. If the name belongs to the same warehouse being updated
 * (or if no name is provided), it allows the request to proceed.
 */
export const validateWarehouseNameOnUpdate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const body = req.body as { name?: unknown };

        if (body?.name === undefined) {
            next();
            return;
        }

        const name = parseNameFromBody(body, res);
        if (name === null) return;

        const warehouseId = Number(req.params.id);
        if (!Number.isInteger(warehouseId) || warehouseId <= 0) {
            res.status(400).json({ error: "Invalid or missing warehouse ID" });
            return;
        }

        const existingWarehouse = await warehouseRepository.findByName(name);
        if (existingWarehouse && existingWarehouse.id !== warehouseId) {
            res.status(409).json({ error: "Another warehouse already uses this name" });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unexpected error validating warehouse name",
        });
    }
};