import { SupplyRequestService } from "../services/supply-request.service.ts";
import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.ts";
import { BaseController } from "./base.controller.ts";

class SupplyRequestController extends BaseController {
    /**
     *
     * @param supplyRequestService - Inject of SupplyRequestService dependency
     * allowing better testing in the future.
     */
    constructor(private supplyRequestService: SupplyRequestService = new SupplyRequestService()) {
        super();
        this.createSupplyRequest = this.createSupplyRequest.bind(this);
        this.findActiveSupplyRequests = this.findActiveSupplyRequests.bind(this);
        this.findSupplyRequestHistory = this.findSupplyRequestHistory.bind(this);
        this.findSupplyRequestsByClinic = this.findSupplyRequestsByClinic.bind(this);
        this.findOneSupplyRequest = this.findOneSupplyRequest.bind(this);
        this.updateSupplyRequestStatus = this.updateSupplyRequestStatus.bind(this);
        this.updateSupplyRequest = this.updateSupplyRequest.bind(this);
        this.deleteSupplyRequest = this.deleteSupplyRequest.bind(this);
        this.restoreSupplyRequest = this.restoreSupplyRequest.bind(this);
    }

    /**
     * Method that creates a new supply request, attributing it to
     * the authenticated user (taken from the JWT payload), and
     * returns it.
     */
    createSupplyRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const requestedByUserId = req.user?.id;
            if (!requestedByUserId) {
                res.status(401).json({ error: "Missing or invalid authorization" });
                return;
            }

            const supplyRequest = await this.supplyRequestService.create(req.body, requestedByUserId);
            res.status(201).json(supplyRequest);
        } catch (error) {
            this.handleError(res, error, 400, { defaultMsg: "Unexpected error creating supply request" });
        }
    };

    /**
     * Method that returns all active (non soft-deleted) supply requests.
     */
    findActiveSupplyRequests = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const requests = await this.supplyRequestService.findAllActive();
            res.status(200).json(requests);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that returns the full history of supply requests ever
     * registered, including soft-deleted ones, for full traceability.
     */
    findSupplyRequestHistory = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const requests = await this.supplyRequestService.findHistory();
            res.status(200).json(requests);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that returns the full history of supply requests made
     * by a single clinic.
     */
    findSupplyRequestsByClinic = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const clinicId = this.validateId(req.params.clinicId, res, "clinic ID");
            if (clinicId === null) return;

            const requests = await this.supplyRequestService.findByClinic(clinicId);
            res.status(200).json(requests);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that returns a single active supply request by its ID.
     */
    findOneSupplyRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res, "supply request ID");
            if (id === null) return;

            const supplyRequest = await this.supplyRequestService.findOne(id);
            res.status(200).json(supplyRequest);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that updates only the status of an existing supply request.
     */
    updateSupplyRequestStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res, "supply request ID");
            if (id === null) return;

            const updated = await this.supplyRequestService.updateStatus(id, req.body);
            res.status(200).json(updated);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that allows an admin to update the editable fields of
     * an existing supply request (clinic, medication, warehouse or
     * quantity), beyond just its status.
     */
    updateSupplyRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res, "supply request ID");
            if (id === null) return;

            const updated = await this.supplyRequestService.update(id, req.body);
            res.status(200).json(updated);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that deletes a supply request using soft-delete.
     */
    deleteSupplyRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res, "supply request ID");
            if (id === null) return;

            const deleted = await this.supplyRequestService.delete(id);
            res.status(200).json({ deleted });
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

    /**
     * Method that restores a deleted supply request.
     */
    restoreSupplyRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
        try {
            const id = this.validateId(req.params.id, res, "supply request ID");
            if (id === null) return;

            const restored = await this.supplyRequestService.restore(id);
            res.status(200).json(restored);
        } catch (error) {
            this.handleError(res, error, 500);
        }
    };

}

export const supplyRequestController = new SupplyRequestController();
