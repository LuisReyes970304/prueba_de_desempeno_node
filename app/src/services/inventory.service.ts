import Inventory from "../models/inventory.model.ts";
import type {
    InventoryCreationDto,
    InventoryUpdateDto,
    InventoryResponseDto,
} from "../dto/inventory.dto.ts";
import { InventoryRepository } from "../repository/inventory.repository.ts";
import type { InventoryServiceInterface } from "./interface/inventory.service.interface.ts";

const inventoryRepository = new InventoryRepository();

export class InventoryService implements InventoryServiceInterface {

    async create(data: InventoryCreationDto): Promise<InventoryResponseDto> {
        if (!data) {
            throw new Error("inventory data is required");
        }

        const created = await inventoryRepository.create(data);

        const withAssociations = await inventoryRepository.findOne(created.id, true);
        if (!withAssociations) {
            throw new Error("Inventory entry was created but could not be retrieved");
        }

        return this.mapToResponseDto(withAssociations);
    }

    async findAll(): Promise<InventoryResponseDto[]> {
        const entries = await inventoryRepository.findAll();
        return entries.map((entry) => this.mapToResponseDto(entry));
    }

    async findOne(id: number): Promise<InventoryResponseDto> {
        const inventory = await inventoryRepository.findOne(id, true);

        if (!inventory) {
            throw new Error("Inventory entry not found");
        }

        return this.mapToResponseDto(inventory);
    }

    async update(id: number, data: InventoryUpdateDto): Promise<InventoryResponseDto> {
        const affectedCount = await inventoryRepository.update(id, data);

        if (!affectedCount) {
            throw new Error("Inventory entry not found");
        }

        const inventoryUpdated = await inventoryRepository.findOne(id, true);

        if (!inventoryUpdated) {
            throw new Error("Inventory entry was updated but could not be retrieved");
        }

        return this.mapToResponseDto(inventoryUpdated);
    }

    async delete(id: number): Promise<boolean> {
        const inventoryDeleted = await inventoryRepository.delete(id);

        if (!inventoryDeleted) {
            throw new Error("Inventory entry not found or already deleted");
        }

        return inventoryDeleted;
    }

    async restore(id: number): Promise<InventoryResponseDto> {
        const inventory = await inventoryRepository.findOne(id, false);

        if (!inventory) {
            throw new Error("Inventory entry not found");
        }

        await inventoryRepository.restore(id);

        return this.findOne(id);
    }

    /**
     * Maps a raw Sequelize Inventory row (with its associations
     * eager-loaded) into the compact response shape: the medication
     * name at the top level, plus a small { id, name } object for
     * the warehouse, instead of dumping every column of both
     * related rows.
     */
    private mapToResponseDto(inventory: Inventory): InventoryResponseDto {
        if (!inventory.medication || !inventory.warehouse) {
            throw new Error("Inventory associations were not loaded");
        }

        return {
            id: inventory.id,
            medicationId: inventory.medicationId,
            name: inventory.medication.name,
            quantity: inventory.quantity,
            warehouse: { id: inventory.warehouse.id, name: inventory.warehouse.name },
        };
    }
}
