import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.middleware.ts";
import { InventoryRepository } from "../repository/inventory.repository.ts";
import { WarehouseRepository } from "../repository/warehouse.repository.ts";
import { MedicationRepository } from "../repository/medication.repository.ts";
import { parsePositiveInteger } from "../utils/validation.util.ts";

const inventoryRepository = new InventoryRepository();
const warehouseRepository = new WarehouseRepository();
const medicationRepository = new MedicationRepository();

interface ParsedInventoryBody {
    warehouseId?: number;
    medicationId?: number;
    quantity?: number;
}

/**
 * Helper that reads and validates the numeric fields of the inventory
 * body. Fields that are not present in the input are left undefined
 * so the caller can decide whether they are required or optional.
 * warehouseId/medicationId reuse the shared positive-integer
 * validator; quantity has its own rule since 0 is a valid stock level.
 */
function parseInventoryBody(
    body: unknown,
    res: Response,
    requiredFields: Array<keyof ParsedInventoryBody>
): ParsedInventoryBody | null {
    const raw = body as Record<string, unknown>;
    const result: ParsedInventoryBody = {};

    for (const field of ["warehouseId", "medicationId", "quantity"] as const) {
        if (raw?.[field] === undefined) {
            if (requiredFields.includes(field)) {
                res.status(400).json({ error: `Invalid or missing ${field}` });
                return null;
            }
            continue;
        }

        if (field === "quantity") {
            const quantity = Number(raw[field]);
            if (!Number.isInteger(quantity) || quantity < 0) {
                res.status(400).json({ error: "Invalid quantity" });
                return null;
            }
            result.quantity = quantity;
            continue;
        }

        const value = parsePositiveInteger(raw[field]);
        if (value === null) {
            res.status(400).json({ error: `Invalid ${field}` });
            return null;
        }

        result[field] = value;
    }

    return result;
}

/**
 * Middleware for POST /inventory.
 * Validates that warehouseId and medicationId exist, that quantity
 * is a non-negative integer, and that no inventory entry already
 * exists for that exact warehouse/medication pair.
 */
export const validateInventoryOnCreate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const parsed = parseInventoryBody(req.body, res, ["warehouseId", "medicationId", "quantity"]);
        if (parsed === null) return;

        const { warehouseId, medicationId } = parsed as Required<ParsedInventoryBody>;

        const warehouse = await warehouseRepository.findOne(warehouseId, true);
        if (!warehouse) {
            res.status(404).json({ error: "Warehouse not found" });
            return;
        }

        const medication = await medicationRepository.findOne(medicationId, true);
        if (!medication) {
            res.status(404).json({ error: "Medication not found" });
            return;
        }

        const existingEntry = await inventoryRepository.findByWarehouseAndMedication(warehouseId, medicationId);
        if (existingEntry) {
            res.status(409).json({ error: "An inventory entry for this warehouse and medication already exists" });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unexpected error validating inventory data",
        });
    }
};

/**
 * Middleware for PATCH /inventory/:id.
 * Validates any provided warehouseId/medicationId still reference
 * existing records, that quantity (if provided) is a non-negative
 * integer, and that the resulting pair does not collide with
 * ANOTHER existing inventory entry.
 */
export const validateInventoryOnUpdate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const inventoryId = Number(req.params.id);
        if (!Number.isInteger(inventoryId) || inventoryId <= 0) {
            res.status(400).json({ error: "Invalid or missing inventory ID" });
            return;
        }

        const parsed = parseInventoryBody(req.body, res, []);
        if (parsed === null) return;

        if (parsed.warehouseId !== undefined) {
            const warehouse = await warehouseRepository.findOne(parsed.warehouseId, true);
            if (!warehouse) {
                res.status(404).json({ error: "Warehouse not found" });
                return;
            }
        }

        if (parsed.medicationId !== undefined) {
            const medication = await medicationRepository.findOne(parsed.medicationId, true);
            if (!medication) {
                res.status(404).json({ error: "Medication not found" });
                return;
            }
        }

        if (parsed.warehouseId !== undefined || parsed.medicationId !== undefined) {
            const currentEntry = await inventoryRepository.findOne(inventoryId, true);
            if (!currentEntry) {
                res.status(404).json({ error: "Inventory entry not found" });
                return;
            }

            const warehouseId = parsed.warehouseId ?? currentEntry.warehouseId;
            const medicationId = parsed.medicationId ?? currentEntry.medicationId;

            const existingEntry = await inventoryRepository.findByWarehouseAndMedication(warehouseId, medicationId);
            if (existingEntry && existingEntry.id !== inventoryId) {
                res.status(409).json({ error: "Another inventory entry for this warehouse and medication already exists" });
                return;
            }
        }

        next();
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unexpected error validating inventory data",
        });
    }
};
