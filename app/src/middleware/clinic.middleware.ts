import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.middleware.ts";
import { ClinicRepository } from "../repository/clinic.repository.ts";
import { parsePositiveInteger } from "../utils/validation.util.ts";

const clinicRepository = new ClinicRepository();

/**
 * Middleware para POST /api/clinicas.
 * Valida que el NIT enviado en el body no exista ya en otra clínica
 * (activa o eliminada lógicamente) antes de intentar crearla.
 */
export const validateNitOnCreate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const nit = parsePositiveInteger((req.body as { nit?: unknown })?.nit);
        if (nit === null) {
            res.status(400).json({ error: "Invalid or missing clinic NIT" });
            return;
        }

        const existingClinic = await clinicRepository.findByNit(nit);
        if (existingClinic) {
            res.status(409).json({ error: "A clinic with this NIT already exists" });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unexpected error validating NIT",
        });
    }
};

/**
 * Middleware para PUT /api/clinicas/:id.
 * Si el body incluye un nit, valida que no choque con el de OTRA
 * clínica ya existente. Si el nit pertenece a la misma clínica que
 * se está actualizando (o no se envía nit), deja pasar la petición.
 */
export const validateNitOnUpdate = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const body = req.body as { nit?: unknown };

        if (body?.nit === undefined) {
            next();
            return;
        }

        const nit = parsePositiveInteger(body.nit);
        if (nit === null) {
            res.status(400).json({ error: "Invalid or missing clinic NIT" });
            return;
        }

        const clinicId = Number(req.params.id);
        if (!Number.isInteger(clinicId) || clinicId <= 0) {
            res.status(400).json({ error: "Invalid or missing clinic ID" });
            return;
        }

        const existingClinic = await clinicRepository.findByNit(nit);
        if (existingClinic && existingClinic.id !== clinicId) {
            res.status(409).json({ error: "Another clinic already uses this NIT" });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unexpected error validating NIT",
        });
    }
};