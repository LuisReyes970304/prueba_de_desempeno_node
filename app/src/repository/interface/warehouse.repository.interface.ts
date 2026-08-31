import Warehouse from "../../models/werehouse.model.ts";
import type { WarehouseCreationDto, WarehouseUpdateDto } from "../../dto/warehouse.dto.ts";

export interface WarehouseRepoInterface {

    /**
     * Creates a new warehouse in the database.
     *
     * @param {WarehouseCreationDto} data - Warehouse data.
     * @returns {Promise<Warehouse>} The created warehouse.
     */
    create(data: WarehouseCreationDto): Promise<Warehouse>;

    /**
     * Returns all active warehouses.
     *
     * @returns {Promise<Warehouse[]>} List of active warehouses.
     */
    findAll(): Promise<Warehouse[]>;

    /**
     * Finds a warehouse by its ID and active status.
     *
     * @param {number} id - Warehouse identifier.
     * @param {boolean} active - Indicates whether the warehouse must be active.
     * @returns {Promise<Warehouse | null>} The warehouse or null if it does not exist.
     */
    findOne(id: number, active: boolean): Promise<Warehouse | null>;

    /**
     * Finds a warehouse by its name.
     *
     * Used to validate unique warehouse names if required.
     *
     * @param {string} name - Warehouse name.
     * @returns {Promise<Warehouse | null>} The warehouse or null if it does not exist.
     */
    findByName(name: string): Promise<Warehouse | null>;

    /**
     * Updates an existing warehouse.
     *
     * @param {number} id - Warehouse identifier.
     * @param {WarehouseUpdateDto} data - Data to update.
     * @returns {Promise<boolean>} True if the warehouse was updated successfully.
     */
    update(id: number, data: WarehouseUpdateDto): Promise<boolean>;

    /**
     * Performs a logical deletion of a warehouse.
     *
     * The warehouse is not physically removed from the database.
     *
     * @param {number} id - Warehouse identifier.
     * @returns {Promise<boolean>} True if the warehouse was successfully deactivated.
     */
    delete(id: number): Promise<boolean>;

    /**
     * Restores a logically deleted warehouse.
     *
     * @param {number} id - Warehouse identifier.
     * @returns {Promise<void>} Resolves when the warehouse is successfully restored.
     */
    restore(id: number): Promise<void>;
}