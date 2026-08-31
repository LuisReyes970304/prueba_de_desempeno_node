import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.middleware.ts";
import { MedicationRepository } from "../repository/medication.repository.ts";
import { parseNonEmptyString } from "../utils/validation.util.ts";

const medicationRepository = new MedicationRepository();

/**
 * Middleware for POST /medication.
 * Validates that the medication name sent in the body does not
 * already exist (including soft-deleted medications) before creating it.
 */
export const validateMedicationNameOnCreate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const name = parseNonEmptyString((req.body as { name?: unknown })?.name);
        if (name === null) {
            res.status(400).json({ error: "Invalid or missing medication name" });
            return;
        }

        const existingMedication = await medicationRepository.findByName(name);
        if (existingMedication) {
            res.status(409).json({ error: "A medication with this name already exists" });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unexpected error validating medication name",
        });
    }
};

/**
 * Middleware for PATCH /medication/:id.
 * If the body includes a name, validates that it does not collide
 * with the name of ANOTHER existing medication.
 */
export const validateMedicationNameOnUpdate = async (
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

        const name = parseNonEmptyString(body.name);
        if (name === null) {
            res.status(400).json({ error: "Invalid or missing medication name" });
            return;
        }

        const medicationId = Number(req.params.id);
        if (!Number.isInteger(medicationId) || medicationId <= 0) {
            res.status(400).json({ error: "Invalid or missing medication ID" });
            return;
        }

        const existingMedication = await medicationRepository.findByName(name);
        if (existingMedication && existingMedication.id !== medicationId) {
            res.status(409).json({ error: "Another medication already uses this name" });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unexpected error validating medication name",
        });
    }
};
