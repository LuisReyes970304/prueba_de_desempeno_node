import Clinic from "../../models/clinic.model.ts";
import type {
    ClinicCreationDto,
    ClinicUpdateDto
} from "../../dto/clinic.dto.ts";

export interface ClinicRepoInterface {

    /**
     * Creates a new clinic in the database.
     *
     * @param {ClinicCreationDto} data - Clinic data.
     * @returns {Promise<Clinic>} The created clinic.
     */
    create(data: ClinicCreationDto): Promise<Clinic>;

    /**
     * Returns all active clinics.
     *
     * @returns {Promise<Clinic[]>} List of active clinics.
     */
    findAll(): Promise<Clinic[]>;

    /**
     * Finds a clinic by its ID and active status.
     *
     * @param {number} id - Clinic identifier.
     * @param {boolean} active - Indicates whether the clinic must be active.
     * @returns {Promise<Clinic | null>} The clinic or null if it does not exist.
     */
    findOne(id: number, active: boolean): Promise<Clinic | null>;

    /**
     * Finds a clinic by its NIT.
     *
     * This method is used to validate that a NIT is not duplicated.
     *
     * @param {number} nit - Clinic NIT.
     * @returns {Promise<Clinic | null>} The clinic or null if the NIT does not exist.
     */
    findByNit(nit: number): Promise<Clinic | null>;

    /**
     * Updates an existing clinic.
     *
     * @param {number} id - Clinic identifier.
     * @param {ClinicUpdateDto} data - Data to update.
     * @returns {Promise<boolean>} True if the clinic was updated successfully.
     */
    update(id: number, data: ClinicUpdateDto): Promise<boolean>;

    /**
     * Performs a logical deletion of a clinic.
     *
     * The clinic is not physically removed from the database.
     *
     * @param {number} id - Clinic identifier.
     * @returns {Promise<boolean>} True if the clinic was successfully deactivated.
     */
    delete(id: number): Promise<boolean>;

    /**
     * Restores a logically deleted clinic.
     *
     * @param {number} id - Clinic identifier.
     * @returns {Promise<boolean>} True if the clinic was successfully restored.
     */
    restore(id: number): Promise<void>;
}

