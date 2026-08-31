/**
 * Data required to create an inventory entry (stock of a medication
 * in a specific warehouse).
 */
export interface InventoryCreationDto {
    warehouseId: number;
    medicationId: number;
    quantity: number;
}

/**
 * Data allowed to update an existing inventory entry.
 */
export interface InventoryUpdateDto {
    warehouseId?: number;
    medicationId?: number;
    quantity?: number;
}
