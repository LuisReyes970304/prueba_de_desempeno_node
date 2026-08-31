import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.middleware.ts";
import { ClinicRepository } from "../repository/clinic.repository.ts";
import { MedicationRepository } from "../repository/medication.repository.ts";
import { WarehouseRepository } from "../repository/warehouse.repository.ts";
import { InventoryRepository } from "../repository/inventory.repository.ts";
import { REQUEST_STATUSES } from "../models/supply-request.model.ts";

const clinicRepository = new ClinicRepository();
const medicationRepository = new MedicationRepository();
const warehouseRepository = new WarehouseRepository();
const inventoryRepository = new InventoryRepository();

/**
 * Helper that reads and validates a positive integer field from
 * the request body.
 */
function parsePositiveIntField(body: unknown, field: string, res: Response): number | null {
    const value = Number((body as Record<string, unknown>)?.[field]);

    if (!Number.isInteger(value) || value <= 0) {
        res.status(400).json({ error: `Invalid or missing ${field}` });
        return null;
    }

    return value;
}

/**
 * Middleware for POST /requests.
 * Validates that:
 *  - clinicId, medicationId, warehouseId and quantity are present
 *    and are positive integers (quantity <= 0 is explicitly rejected).
 *  - The referenced clinic, medication and warehouse all exist.
 *  - The warehouse holds enough stock of that medication to cover
 *    the requested quantity.
 */
export const validateSupplyRequestOnCreate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const clinicId = parsePositiveIntField(req.body, "clinicId", res);
        if (clinicId === null) return;

        const medicationId = parsePositiveIntField(req.body, "medicationId", res);
        if (medicationId === null) return;

        const warehouseId = parsePositiveIntField(req.body, "warehouseId", res);
        if (warehouseId === null) return;

        const quantity = parsePositiveIntField(req.body, "quantity", res);
        if (quantity === null) return;

        const clinic = await clinicRepository.findOne(clinicId, true);
        if (!clinic) {
            res.status(404).json({ error: "Clinic not found" });
            return;
        }

        const medication = await medicationRepository.findOne(medicationId, true);
        if (!medication) {
            res.status(404).json({ error: "Medication not found" });
            return;
        }

        const warehouse = await warehouseRepository.findOne(warehouseId, true);
        if (!warehouse) {
            res.status(404).json({ error: "Warehouse not found" });
            return;
        }

        const inventoryEntry = await inventoryRepository.findByWarehouseAndMedication(warehouseId, medicationId);
        const availableStock = inventoryEntry?.quantity ?? 0;

        if (availableStock < quantity) {
            res.status(409).json({
                error: `Insufficient inventory: only ${availableStock} unit(s) of this medication are available in the selected warehouse`,
            });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unexpected error validating supply request data",
        });
    }
};

/**
 * Middleware for PATCH /requests/:id/status.
 * Validates that the target status is one of the allowed values.
 */
export const validateStatusUpdate = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void => {
    const status = (req.body as { status?: unknown })?.status;

    if (typeof status !== "string" || !REQUEST_STATUSES.includes(status as typeof REQUEST_STATUSES[number])) {
        res.status(400).json({
            error: `Invalid status. Allowed statuses are: ${REQUEST_STATUSES.join(", ")}`,
        });
        return;
    }

    next();
};
