import { ClinicService } from "../services/clinic.service.ts";
import type { Response, Request } from "express";

class ClinicController {
    /**
     *
     * @param clinicService - Inject of ClinicService dependency
     * allowing better testing in the future.
     */
    constructor(private clinicService: ClinicService = new ClinicService()) {
        this.findAllClinics = this.findAllClinics.bind(this);
        this.findOneClinic = this.findOneClinic.bind(this);
        this.createClinic = this.createClinic.bind(this);
        this.updateClinic = this.updateClinic.bind(this);
        this.deleteClinic = this.deleteClinic.bind(this);
        this.restoreClinic = this.restoreClinic.bind(this);
    }

    /**
     * Method that creates a new clinic and then returns it.
     */
    createClinic = async (req: Request, res: Response): Promise<void> => {
        try {
            const clinic = await this.clinicService.create(req.body);
            res.status(201).json(clinic);
        } catch (error) {
            this.handleError(res, error, 400, "Unexpected error creating clinic");
        }
    };

    /**
     * Method that returns all the clinics in the database.
     */
    findAllClinics = async (_req: Request, res: Response): Promise<void> => {
        try {
            const clinics = await this.clinicService.findAll();
            res.status(200).json(clinics);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that returns a clinic by its ID.
     */
    findOneClinic = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const clinic = await this.clinicService.findOne(id);
            res.status(200).json(clinic);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that allows updating a clinic and then returns the updated clinic.
     */
    updateClinic = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const clinicUpdated = await this.clinicService.update(id, req.body);
            res.status(200).json(clinicUpdated);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that deletes a clinic using soft-delete.
     */
    deleteClinic = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const clinicDeleted = await this.clinicService.delete(id);
            res.status(200).json({ clinicDeleted });
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that restores a deleted clinic.
     */
    restoreClinic = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res);
            if (id === null) return;

            const clinicRestored = await this.clinicService.restore(id);
            res.status(200).json(clinicRestored);
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
                error: "Invalid or missing clinic ID"
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
        const message = error instanceof Error ? error.message : defaultMsg;
        const status = message.toLowerCase().includes("not found")
            ? 404
            : defaultStatus;

        res.status(status).json({ error: message });
    }
}

export const clinicController = new ClinicController();
