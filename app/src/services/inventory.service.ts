import Inventory from "../models/inventory.model.ts";
import type { InventoryCreationDto, InventoryUpdateDto } from "../dto/inventory.dto.ts";
import { InventoryRepository } from "../repository/inventory.repository.ts";
import type { InventoryServiceInterface } from "./interface/inventory.service.interface.ts";

const inventoryRepository = new InventoryRepository();

export class InventoryService implements InventoryServiceInterface {

    async create(data: InventoryCreationDto): Promise<Inventory> {
        if (!data) {
            throw new Error("inventory data is required");
        }

        return await inventoryRepository.create(data);
    }

    async findAll(): Promise<Inventory[]> {
        return await inventoryRepository.findAll();
    }

    async findOne(id: number): Promise<Inventory> {
        const inventory = await inventoryRepository.findOne(id, true);

        if (!inventory) {
            throw new Error("Inventory entry not found");
        }

        return inventory;
    }

    async update(id: number, data: InventoryUpdateDto): Promise<Inventory> {
        const affectedCount = await inventoryRepository.update(id, data);

        if (!affectedCount) {
            throw new Error("Inventory entry not found");
        }

        const inventoryUpdated = await inventoryRepository.findOne(id, true);

        if (!inventoryUpdated) {
            throw new Error("Inventory entry was updated but could not be retrieved");
        }

        return inventoryUpdated;
    }

    async delete(id: number): Promise<boolean> {
        const inventoryDeleted = await inventoryRepository.delete(id);

        if (!inventoryDeleted) {
            throw new Error("Inventory entry not found or already deleted");
        }

        return inventoryDeleted;
    }

    async restore(id: number): Promise<Inventory> {
        const inventory = await inventoryRepository.findOne(id, false);

        if (!inventory) {
            throw new Error("Inventory entry not found");
        }

        await inventoryRepository.restore(id);

        return inventory;
    }
}
