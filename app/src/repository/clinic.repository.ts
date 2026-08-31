import type { ClinicRepoInterface } from "./interface/clinic.repository.inteface.ts";
import Clinic from "../models/clinic.model.ts";
import type {
    ClinicCreationDto,
    ClinicUpdateDto
} from "../dto/clinic.dto.ts";
import { updatePartial } from "../utils/sequelize.util.ts";

/**
 * This class is the clinic repository.
 * It is the only layer that interacts directly with Sequelize methods.
 */
export class ClinicRepository implements ClinicRepoInterface {

    /**
     * This method has as objective the creation of a new clinic.
     *
     * @param {ClinicCreationDto} data - Uses the interface DTO for clinic creation.
     * @returns {Clinic} - Returns the clinic created.
     */
    async create(data: ClinicCreationDto): Promise<Clinic> {
        return await Clinic.create(data);
    }

    /**
     * This method has as objective finding all active clinics
     * in the database.
     *
     * @returns {Clinic[]} - Returns all active clinics in an array.
     */
    async findAll(): Promise<Clinic[]> {
        return await Clinic.findAll();
    }

    /**
     * This method has as objective finding a clinic in the database.
     *
     * If active is true, it looks only for active clinics.
     * If active is false, it also allows finding clinics deleted
     * through soft-delete.
     *
     * @param {number} id - Uses the ID to find a clinic.
     * @param {boolean} active - Determines whether soft-deleted clinics
     * should be excluded.
     * @returns {Clinic | null} - Returns the clinic or null if it does not exist.
     */
    async findOne(id: number, active: boolean): Promise<Clinic | null> {
        return await Clinic.findOne({
            where: { id },
            paranoid: active
        });
    }

    /**
     * This method looks for a clinic by its NIT.
     *
     * It is used to verify that a clinic with the same NIT
     * does not already exist in the database.
     *
     * Includes logically deleted clinics (paranoid: false), because
     * the NIT column's unique constraint at the database level also
     * applies to soft-deleted rows.
     *
     * @param {number} nit - Uses the NIT to find a clinic.
     * @returns {Clinic | null} - Returns the clinic or null if it does not exist.
     */
    async findByNit(nit: number): Promise<Clinic | null> {
        return await Clinic.findOne({
            where: { nit },
            paranoid: false
        });
    }

    /**
     * This method has as objective updating an existing clinic.
     *
     * If there is no clinic with the provided ID, the method
     * returns false. Otherwise, it updates the clinic.
     *
     * @param {number} id - Uses the ID of the clinic to find it.
     * @param {ClinicUpdateDto} data - Uses the Clinic Update DTO
     * to update the clinic data.
     * @returns {boolean} - Returns true if the clinic was updated.
     */
    async update(
        id: number,
        data: ClinicUpdateDto
    ): Promise<boolean> {
        return await updatePartial(Clinic, id, data);
    }

    /**
     * This method uses the clinic ID to delete it with a soft-delete.
     *
     * The clinic is not physically removed from the database.
     *
     * @param {number} id - Uses the clinic ID to delete it.
     * @returns {boolean} - Returns true if the clinic was deleted.
     */
    async delete(id: number): Promise<boolean> {
        const affectedRow = await Clinic.destroy({
            where: { id }
        });

        return affectedRow > 0;
    }

    /**
     * This method allows restoring a clinic that was deleted
     * through soft-delete.
     *
     * @param {number} id - Uses the clinic ID to restore it.
     * @returns {void} - Restores the deleted clinic.
     */
    async restore(id: number): Promise<void> {
        return await Clinic.restore({
            where: { id }
        });
    }
}

