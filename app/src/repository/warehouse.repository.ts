import type { WarehouseRepoInterface } from "./interface/warehouse.repository.interface.ts";
import Warehouse from "../models/werehouse.model.ts";
import type {
    WarehouseCreationDto,
    WarehouseUpdateDto
} from "../dto/warehouse.dto.ts";

/**
 * This class is the warehouse repository.
 * It is the only layer that interacts directly with Sequelize methods.
 */
export class WarehouseRepository implements WarehouseRepoInterface {

    /**
     * This method has as objective the creation of a new warehouse.
     *
     * @param {WarehouseCreationDto} data - Uses the interface DTO for warehouse creation.
     * @returns {Warehouse} - Returns the warehouse created.
     */
    async create(data: WarehouseCreationDto): Promise<Warehouse> {
        return await Warehouse.create(data);
    }

    /**
     * This method has as objective finding all active warehouses
     * in the database.
     *
     * @returns {Warehouse[]} - Returns all active warehouses in an array.
     */
    async findAll(): Promise<Warehouse[]> {
        return await Warehouse.findAll();
    }

    /**
     * This method has as objective finding a warehouse in the database.
     *
     * If active is true, it looks only for active warehouses.
     * If active is false, it also allows finding warehouses deleted
     * through soft-delete.
     *
     * @param {number} id - Uses the ID to find a warehouse.
     * @param {boolean} active - Determines whether soft-deleted warehouses
     * should be excluded.
     * @returns {Warehouse | null} - Returns the warehouse or null if it does not exist.
     */
    async findOne(id: number, active: boolean): Promise<Warehouse | null> {
        return await Warehouse.findOne({
            where: { id },
            paranoid: active
        });
    }

    /**
     * This method looks for a warehouse by its name.
     *
     * It is used to verify that a warehouse with the same name
     * does not already exist in the database.
     *
     * @param {string} name - Uses the name to find a warehouse.
     * @returns {Warehouse | null} - Returns the warehouse or null if it does not exist.
     */
    async findByName(name: string): Promise<Warehouse | null> {
        return await Warehouse.findOne({
            where: { name }
        });
    }

    /**
     * This method has as objective updating an existing warehouse.
     *
     * If there is no warehouse with the provided ID, the method
     * returns false. Otherwise, it updates the warehouse.
     *
     * @param {number} id - Uses the ID of the warehouse to find it.
     * @param {WarehouseUpdateDto} data - Uses the Warehouse Update DTO
     * to update the warehouse data.
     * @returns {boolean} - Returns true if the warehouse was updated.
     */
    async update(
        id: number,
        data: WarehouseUpdateDto
    ): Promise<boolean> {
        const [affectedCount] = await Warehouse.update(
            data,
            {
                where: { id }
            }
        );

        return affectedCount > 0;
    }

    /**
     * This method uses the warehouse ID to delete it with a soft-delete.
     *
     * The warehouse is not physically removed from the database.
     *
     * @param {number} id - Uses the warehouse ID to delete it.
     * @returns {boolean} - Returns true if the warehouse was deleted.
     */
    async delete(id: number): Promise<boolean> {
        const affectedRow = await Warehouse.destroy({
            where: { id }
        });

        return affectedRow > 0;
    }

    /**
     * This method allows restoring a warehouse that was deleted
     * through soft-delete.
     *
     * @param {number} id - Uses the warehouse ID to restore it.
     * @returns {void} - Restores the deleted warehouse.
     */
    async restore(id: number): Promise<void> {
        return await Warehouse.restore({
            where: { id }
        });
    }
}