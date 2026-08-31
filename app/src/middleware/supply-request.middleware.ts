import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.middleware.ts";
import { ClinicRepository } from "../repository/clinic.repository.ts";
import { MedicationRepository } from "../repository/medication.repository.ts";
import { WarehouseRepository } from "../repository/warehouse.repository.ts";
import { InventoryRepository } from "../repository/inventory.repository.ts";
import { SupplyRequestRepository } from "../repository/supply-request.repository.ts";
import { REQUEST_STATUSES } from "../models/supply-request.model.ts";
import { parsePositiveInteger } from "../utils/validation.util.ts";

const clinicRepository = new ClinicRepository();
const medicationRepository = new MedicationRepository();
const warehouseRepository = new WarehouseRepository();
const inventoryRepository = new InventoryRepository();
const supplyRequestRepository = new SupplyRequestRepository();

/**
 * Helper that reads a field from the body, validates it as a
 * positive integer, and responds with 400 if it isn't.
 */
function parsePositiveIntField(body: unknown, field: string, res: Response): number | null {
    const value = parsePositiveInteger((body as Record<string, unknown>)?.[field]);

    if (value === null) {
        res.status(400).json({ error: `Invalid or missing ${field}` });
        return null;
    }

    return value;
}

/**
 * Shared core validation: given a resolved clinicId/medicationId/
 * warehouseId/quantity combination, checks that the clinic, medication
 * and warehouse exist, and that the warehouse holds enough stock of
 * that medication to cover the quantity. Used by both the create and
 * the full-update middlewares, so the business rule is defined once.
 *
 * @returns true if valid (nothing written to res), false if an error
 * response was already sent and the caller must stop.
 */
async function validateClinicMedicationWarehouseStock(
    clinicId: number,
    medicationId: number,
    warehouseId: number,
    quantity: number,
    res: Response,
): Promise<boolean> {
    const clinic = await clinicRepository.findOne(clinicId, true);
    if (!clinic) {
        res.status(404).json({ error: "Clinic not found" });
        return false;
    }

    const medication = await medicationRepository.findOne(medicationId, true);
    if (!medication) {
        res.status(404).json({ error: "Medication not found" });
        return false;
    }

    const warehouse = await warehouseRepository.findOne(warehouseId, true);
    if (!warehouse) {
        res.status(404).json({ error: "Warehouse not found" });
        return false;
    }

    const inventoryEntry = await inventoryRepository.findByWarehouseAndMedication(warehouseId, medicationId);
    const availableStock = inventoryEntry?.quantity ?? 0;

    if (availableStock < quantity) {
        res.status(409).json({
            error: `Insufficient inventory: only ${availableStock} unit(s) of this medication are available in the selected warehouse`,
        });
        return false;
    }

    return true;
}

/**
 * Middleware for POST /requests.
 * Validates that clinicId, medicationId, warehouseId and quantity
 * are present and are positive integers (quantity <= 0 is explicitly
 * rejected), that the referenced clinic/medication/warehouse exist,
 * and that the warehouse holds enough stock.
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

        const isValid = await validateClinicMedicationWarehouseStock(clinicId, medicationId, warehouseId, quantity, res);
        if (!isValid) return;

        next();
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unexpected error validating supply request data",
        });
    }
};

/**
 * Middleware for PUT /requests/:id.
 * The full-update endpoint lets an admin change clinicId, medicationId,
 * warehouseId and/or quantity. Every field is optional here (partial
 * update), but whichever combination results after merging with the
 * current row must still pass the same existence + stock rules as a
 * brand new request — otherwise an admin could bypass validation
 * entirely by editing an existing request instead of creating one.
 */
export const validateSupplyRequestOnUpdate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const id = parsePositiveInteger(req.params.id);
        if (id === null) {
            res.status(400).json({ error: "Invalid or missing supply request ID" });
            return;
        }

        const body = req.body as Record<string, unknown>;
        const fields = ["clinicId", "medicationId", "warehouseId", "quantity"] as const;

        if (!fields.some((field) => body?.[field] !== undefined)) {
            // Nothing relevant to re-validate; let the controller handle a no-op update.
            next();
            return;
        }

        const currentRequest = await supplyRequestRepository.findOne(id, true);
        if (!currentRequest) {
            res.status(404).json({ error: "Supply request not found" });
            return;
        }

        const parsedValues: Record<(typeof fields)[number], number | null> = {
            clinicId: currentRequest.clinicId,
            medicationId: currentRequest.medicationId,
            warehouseId: currentRequest.warehouseId,
            quantity: currentRequest.quantity,
        };

        for (const field of fields) {
            if (body[field] === undefined) continue;

            const parsed = parsePositiveIntField(body, field, res);
            if (parsed === null) return;

            parsedValues[field] = parsed;
        }

        const isValid = await validateClinicMedicationWarehouseStock(
            parsedValues.clinicId as number,
            parsedValues.medicationId as number,
            parsedValues.warehouseId as number,
            parsedValues.quantity as number,
            res,
        );
        if (!isValid) return;

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
