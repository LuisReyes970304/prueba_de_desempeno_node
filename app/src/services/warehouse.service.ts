import Warehouse from "../models/werehouse.model.ts";
import type { 
    WarehouseCreationDto, 
    WarehouseUpdateDto 
} from "../dto/warehouse.dto.ts";
import { WarehouseRepository } from "../repository/warehouse.repository.ts";
import type { WarehouseServiceInterface } from "./interface/warehouse.service.interface.ts";

const warehouseRepository = new WarehouseRepository();

export class WarehouseService implements WarehouseServiceInterface {
    async create(data: WarehouseCreationDto): Promise<Warehouse> {
        if (!data || !data.name || !data.location) {
            throw new Error("Name and location are required");
        }

        const existingWarehouse = await warehouseRepository.findByName(data.name);
        if (existingWarehouse) {
            throw new Error("A warehouse with this name already exists");
        }

        return await warehouseRepository.create(data);
    }

    async findAll(): Promise<Warehouse[]> {
        const warehousesList = await warehouseRepository.findAll();
        return warehousesList;
    }

    async findOne(id: number): Promise<Warehouse> {
        const warehouse = await warehouseRepository.findOne(id, true);
        if (!warehouse) {
            throw new Error("Warehouse not found");
        }
        return warehouse;
    }

    async update(id: number, data: WarehouseUpdateDto): Promise<Warehouse> {
        if (data.name) {
            const existingWarehouse = await warehouseRepository.findByName(data.name);
            if (existingWarehouse && existingWarehouse.id !== id) {
                throw new Error("A warehouse with this name already exists");
            }
        }

        const affectedCount = await warehouseRepository.update(id, data);
        if (!affectedCount) {
            throw new Error("Warehouse not found");
        }

        const warehouseUpdated = await warehouseRepository.findOne(id, true);
        if (!warehouseUpdated) {
            throw new Error("Warehouse was updated but could not be retrieved");
        }

        return warehouseUpdated;
    }

    async delete(id: number): Promise<boolean> {
        const warehouseDeleted = await warehouseRepository.delete(id);
        if (!warehouseDeleted) {
            throw new Error("Warehouse not found or already deleted");
        }
        return warehouseDeleted;
    }

    async restore(id: number): Promise<Warehouse> {
        const warehouse = await warehouseRepository.findOne(id, false);
        if (!warehouse) {
            throw new Error("Warehouse not found");
        }
        await warehouseRepository.restore(id);
        return warehouse;
    }
}