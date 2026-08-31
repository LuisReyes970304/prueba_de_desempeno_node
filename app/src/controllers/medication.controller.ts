import { MedicationService } from "../services/medication.service.ts";
import type { Response, Request } from "express";

class MedicationController {
    /**
     *
     * @param medicationService - Inject of MedicationService dependency
     * allowing better testing in the future.
     */
    constructor(private medicationService: MedicationService = new MedicationService()) {
        this.findAllMedications = this.findAllMedications.bind(this);
        this.findOneMedication = this.findOneMedication.bind(this);
        this.createMedication = this.createMedication.bind(this);
        this.updateMedication = this.updateMedication.bind(this);
        this.deleteMedication = this.deleteMedication.bind(this);
        this.restoreMedication = this.restoreMedication.bind(this);
    }

    /**
     * Method that creates a new medication and then returns it.
     */
    createMedication = async (req: Request, res: Response): Promise<void> => {
        try {
            const medication = await this.medicationService.create(req.body);
            res.status(201).json(medication);
        } catch (error) {
            this.handleError(res, error, 400, "Unexpected error creating medication");
        }
    };

    /**
     * Method that returns all the medications in the database.
     */
    findAllMedications = async (_req: Request, res: Response): Promise<void> => {
        try {
            const medications = await this.medicationService.findAll();
            res.status(200).json(medications);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that returns a medication by its ID.
     */
    findOneMedication = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const medication = await this.medicationService.findOne(id);
            res.status(200).json(medication);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that allows updating a medication and then returns the updated medication.
     */
    updateMedication = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const medicationUpdated = await this.medicationService.update(id, req.body);
            res.status(200).json(medicationUpdated);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that deletes a medication using soft-delete.
     */
    deleteMedication = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const medicationDeleted = await this.medicationService.delete(id);
            res.status(200).json({ medicationDeleted });
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that restores a deleted medication.
     */
    restoreMedication = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const medicationRestored = await this.medicationService.restore(id);
            res.status(200).json(medicationRestored);
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
                error: "Invalid or missing medication ID"
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
            res.status(409).json({ error: "A medication with this name already exists" });
            return;
        }

        const message = error instanceof Error ? error.message : defaultMsg;
        const status = message.toLowerCase().includes("not found")
            ? 404
            : defaultStatus;

        res.status(status).json({ error: message });
    }
}

export const medicationController = new MedicationController();
