import Medication from "../../models/medication.model.ts";
import type { MedicationCreationDto, MedicationUpdateDto } from "../../dto/medication.dto.ts";

export interface MedicationRepoInterface {

    /**
     * Creates a new medication in the database.
     *
     * @param {MedicationCreationDto} data - Medication data.
     * @returns {Promise<Medication>} The created medication.
     */
    create(data: MedicationCreationDto): Promise<Medication>;

    /**
     * Returns all active medications.
     *
     * @returns {Promise<Medication[]>} List of active medications.
     */
    findAll(): Promise<Medication[]>;

    /**
     * Finds a medication by its ID and active status.
     *
     * @param {number} id - Medication identifier.
     * @param {boolean} active - Indicates whether the medication must be active.
     * @returns {Promise<Medication | null>} The medication or null if it does not exist.
     */
    findOne(id: number, active: boolean): Promise<Medication | null>;

    /**
     * Finds a medication by its name.
     *
     * Used to validate that a medication name is not duplicated.
     * Includes soft-deleted rows, since names are not enforced unique
     * at the database level but a friendly duplicate check is still useful.
     *
     * @param {string} name - Medication name.
     * @returns {Promise<Medication | null>} The medication or null if it does not exist.
     */
    findByName(name: string): Promise<Medication | null>;

    /**
     * Updates an existing medication.
     *
     * @param {number} id - Medication identifier.
     * @param {MedicationUpdateDto} data - Data to update.
     * @returns {Promise<boolean>} True if the medication was updated successfully.
     */
    update(id: number, data: MedicationUpdateDto): Promise<boolean>;

    /**
     * Performs a logical deletion of a medication.
     *
     * @param {number} id - Medication identifier.
     * @returns {Promise<boolean>} True if the medication was successfully deactivated.
     */
    delete(id: number): Promise<boolean>;

    /**
     * Restores a logically deleted medication.
     *
     * @param {number} id - Medication identifier.
     * @returns {Promise<void>} Resolves when the medication is successfully restored.
     */
    restore(id: number): Promise<void>;
}
