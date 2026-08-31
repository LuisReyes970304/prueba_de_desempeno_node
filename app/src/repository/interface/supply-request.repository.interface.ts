import SupplyRequest from "../../models/supply-request.model.ts";
import type { SupplyRequestCreationDto, SupplyRequestUpdateDto } from "../../dto/supply-request.dto.ts";

export interface SupplyRequestRepoInterface {

    /**
     * Creates a new supply request in the database, with status
     * defaulting to "pending".
     *
     * @param {SupplyRequestCreationDto} data - Supply request data.
     * @param {number} requestedByUserId - ID of the user creating the request.
     * @returns {Promise<SupplyRequest>} The created supply request.
     */
    create(data: SupplyRequestCreationDto, requestedByUserId: number): Promise<SupplyRequest>;

    /**
     * Returns all active (non soft-deleted) supply requests, with
     * their clinic, warehouse, medication and requester eagerly loaded.
     *
     * @returns {Promise<SupplyRequest[]>} List of active supply requests.
     */
    findAllActive(): Promise<SupplyRequest[]>;

    /**
     * Returns the full history of supply requests, including
     * soft-deleted ones, for full traceability.
     *
     * @returns {Promise<SupplyRequest[]>} List of every supply request ever registered.
     */
    findHistory(): Promise<SupplyRequest[]>;

    /**
     * Returns the full history of supply requests for a single
     * clinic, including soft-deleted ones.
     *
     * @param {number} clinicId - Clinic identifier.
     * @returns {Promise<SupplyRequest[]>} List of supply requests made by that clinic.
     */
    findByClinic(clinicId: number): Promise<SupplyRequest[]>;

    /**
     * Finds a supply request by its ID and active status.
     *
     * @param {number} id - Supply request identifier.
     * @param {boolean} active - Indicates whether the request must be active.
     * @returns {Promise<SupplyRequest | null>} The request or null if it does not exist.
     */
    findOne(id: number, active: boolean): Promise<SupplyRequest | null>;

    /**
     * Updates the status of an existing supply request.
     *
     * @param {number} id - Supply request identifier.
     * @param {string} status - New status value.
     * @returns {Promise<boolean>} True if the request was updated successfully.
     */
    updateStatus(id: number, status: string): Promise<boolean>;

    /**
     * Updates the editable fields of an existing supply request.
     *
     * @param {number} id - Supply request identifier.
     * @param {SupplyRequestUpdateDto} data - Data to update.
     * @returns {Promise<boolean>} True if the request was updated successfully.
     */
    update(id: number, data: SupplyRequestUpdateDto): Promise<boolean>;

    /**
     * Performs a logical deletion of a supply request.
     *
     * @param {number} id - Supply request identifier.
     * @returns {Promise<boolean>} True if the request was successfully deactivated.
     */
    delete(id: number): Promise<boolean>;

    /**
     * Restores a logically deleted supply request.
     *
     * @param {number} id - Supply request identifier.
     * @returns {Promise<void>} Resolves when the request is successfully restored.
     */
    restore(id: number): Promise<void>;
}
