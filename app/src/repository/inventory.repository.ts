import type { InventoryRepoInterface } from "./interface/inventory.repository.interface.ts";
import Inventory from "../models/inventory.model.ts";
import Warehouse from "../models/werehouse.model.ts";
import Medication from "../models/medication.model.ts";
import type { InventoryCreationDto, InventoryUpdateDto } from "../dto/inventory.dto.ts";
import { updatePartial } from "../utils/sequelize.util.ts";

/**
 * This class is the inventory repository.
 * It is the only layer that interacts directly with Sequelize methods.
 */
export class InventoryRepository implements InventoryRepoInterface {

    async create(data: InventoryCreationDto): Promise<Inventory> {
        return await Inventory.create(data);
    }

    async findAll(): Promise<Inventory[]> {
        return await Inventory.findAll({
            include: [
                { model: Warehouse, as: "warehouse" },
                { model: Medication, as: "medication" },
            ],
        });
    }

    async findOne(id: number, active: boolean): Promise<Inventory | null> {
        return await Inventory.findOne({
            where: { id },
            paranoid: active,
            include: [
                { model: Warehouse, as: "warehouse" },
                { model: Medication, as: "medication" },
            ],
        });
    }

    async findByWarehouseAndMedication(warehouseId: number, medicationId: number): Promise<Inventory | null> {
        return await Inventory.findOne({
            where: { warehouseId, medicationId },
            paranoid: false
        });
    }

    async update(id: number, data: InventoryUpdateDto): Promise<boolean> {
        return await updatePartial(Inventory, id, data);
    }

    async delete(id: number): Promise<boolean> {
        const affectedRow = await Inventory.destroy({
            where: { id }
        });

        return affectedRow > 0;
    }

    async restore(id: number): Promise<void> {
        return await Inventory.restore({
            where: { id }
        });
    }
}
