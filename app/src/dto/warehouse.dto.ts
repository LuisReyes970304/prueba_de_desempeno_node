/**
 * This is the DTO needed for warehouse creation.
 */
export interface WarehouseCreationDto {
    name: string;
    location: string;
    phone: number;
}

/**
 * This is the DTO used for updating a warehouse.
 */
export interface WarehouseUpdateDto {
    name?: string;
    location?: string;
    phone?: number;
}