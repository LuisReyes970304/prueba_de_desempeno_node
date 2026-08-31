import Warehouse from "../../models/werehouse.model.ts";
import type { WarehouseCreationDto, WarehouseUpdateDto } from "../../dto/warehouse.dto.ts";

/**
 * This is the interface for the warehouse service class.
 */
export interface WarehouseServiceInterface {

    create(data: WarehouseCreationDto): Promise<Warehouse>;

    findAll(): Promise<Warehouse[]>;

    findOne(id: number): Promise<Warehouse>;

    update(id: number, data: WarehouseUpdateDto): Promise<Warehouse>;

    delete(id: number): Promise<boolean>;

    restore(id: number): Promise<Warehouse>;
}