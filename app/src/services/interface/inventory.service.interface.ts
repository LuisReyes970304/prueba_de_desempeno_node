import Inventory from "../../models/inventory.model.ts";
import type { InventoryCreationDto, InventoryUpdateDto } from "../../dto/inventory.dto.ts";

/**
 * This is the interface for the inventory service class.
 */
export interface InventoryServiceInterface {
    create(data: InventoryCreationDto): Promise<Inventory>;

    findAll(): Promise<Inventory[]>;

    findOne(id: number): Promise<Inventory>;

    update(id: number, data: InventoryUpdateDto): Promise<Inventory>;

    delete(id: number): Promise<boolean>;

    restore(id: number): Promise<Inventory>;
}
