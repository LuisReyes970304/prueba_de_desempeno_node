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

/**
 * Compact shape returned to clients: the medication name at the
 * top level, plus a small { id, name } object for the warehouse,
 * instead of dumping every column of both related rows.
 */
export interface InventoryResponseDto {
    id: number;
    medicationId: number;
    name: string;
    quantity: number;
    warehouse: { id: number; name: string };
}
