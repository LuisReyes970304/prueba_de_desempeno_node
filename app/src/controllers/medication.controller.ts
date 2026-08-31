import { MedicationService } from "../services/medication.service.ts";
import type { Response, Request } from "express";
import { BaseController } from "./base.controller.ts";

class MedicationController extends BaseController {
    /**
     *
     * @param medicationService - Inject of MedicationService dependency
     * allowing better testing in the future.
     */
    constructor(private medicationService: MedicationService = new MedicationService()) {
        super();
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
            this.handleError(res, error, 400, {
                defaultMsg: "Unexpected error creating medication",
                uniqueConstraintMessage: "A medication with this name already exists",
            });
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
            const id = this.validateId(req.params.id, res, "medication ID");
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
            const id = this.validateId(req.params.id, res, "medication ID");
            if (id === null) return;

            const medicationUpdated = await this.medicationService.update(id, req.body);
            res.status(200).json(medicationUpdated);
        } catch (error) {
            this.handleError(res, error, 500, { uniqueConstraintMessage: "A medication with this name already exists" });
        }
    };

    /**
     * Method that deletes a medication using soft-delete.
     */
    deleteMedication = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res, "medication ID");
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
            const id = this.validateId(req.params.id, res, "medication ID");
            if (id === null) return;

            const medicationRestored = await this.medicationService.restore(id);
            res.status(200).json(medicationRestored);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };
}

export const medicationController = new MedicationController();
