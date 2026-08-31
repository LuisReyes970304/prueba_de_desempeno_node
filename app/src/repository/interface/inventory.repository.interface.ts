import Inventory from "../../models/inventory.model.ts";
import type { InventoryCreationDto, InventoryUpdateDto } from "../../dto/inventory.dto.ts";

export interface InventoryRepoInterface {

    /**
     * Creates a new inventory entry in the database.
     *
     * @param {InventoryCreationDto} data - Inventory data.
     * @returns {Promise<Inventory>} The created inventory entry.
     */
    create(data: InventoryCreationDto): Promise<Inventory>;

    /**
     * Returns all active inventory entries.
     *
     * @returns {Promise<Inventory[]>} List of active inventory entries.
     */
    findAll(): Promise<Inventory[]>;

    /**
     * Finds an inventory entry by its ID and active status.
     *
     * @param {number} id - Inventory entry identifier.
     * @param {boolean} active - Indicates whether the entry must be active.
     * @returns {Promise<Inventory | null>} The entry or null if it does not exist.
     */
    findOne(id: number, active: boolean): Promise<Inventory | null>;

    /**
     * Finds an inventory entry by its warehouse/medication pair.
     *
     * Used to validate that no duplicate stock line exists for the
     * same warehouse and medication, and to check available stock
     * when validating a supply request.
     *
     * @param {number} warehouseId - Warehouse identifier.
     * @param {number} medicationId - Medication identifier.
     * @returns {Promise<Inventory | null>} The entry or null if it does not exist.
     */
    findByWarehouseAndMedication(warehouseId: number, medicationId: number): Promise<Inventory | null>;

    /**
     * Updates an existing inventory entry.
     *
     * @param {number} id - Inventory entry identifier.
     * @param {InventoryUpdateDto} data - Data to update.
     * @returns {Promise<boolean>} True if the entry was updated successfully.
     */
    update(id: number, data: InventoryUpdateDto): Promise<boolean>;

    /**
     * Performs a logical deletion of an inventory entry.
     *
     * @param {number} id - Inventory entry identifier.
     * @returns {Promise<boolean>} True if the entry was successfully deactivated.
     */
    delete(id: number): Promise<boolean>;

    /**
     * Restores a logically deleted inventory entry.
     *
     * @param {number} id - Inventory entry identifier.
     * @returns {Promise<void>} Resolves when the entry is successfully restored.
     */
    restore(id: number): Promise<void>;
}
