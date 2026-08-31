import type { InventoryCreationDto, InventoryUpdateDto, InventoryResponseDto } from "../../dto/inventory.dto.ts";

/**
 * This is the interface for the inventory service class.
 */
export interface InventoryServiceInterface {
    create(data: InventoryCreationDto): Promise<InventoryResponseDto>;

    findAll(): Promise<InventoryResponseDto[]>;

    findOne(id: number): Promise<InventoryResponseDto>;

    update(id: number, data: InventoryUpdateDto): Promise<InventoryResponseDto>;

    delete(id: number): Promise<boolean>;

    restore(id: number): Promise<InventoryResponseDto>;
}
