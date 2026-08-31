import type { SupplyRequestRepoInterface } from "./interface/supply-request.repository.interface.ts";
import SupplyRequest from "../models/supply-request.model.ts";
import Clinic from "../models/clinic.model.ts";
import Medication from "../models/medication.model.ts";
import Warehouse from "../models/werehouse.model.ts";
import User from "../models/user.model.ts";
import type { SupplyRequestCreationDto, SupplyRequestUpdateDto } from "../dto/supply-request.dto.ts";

/**
 * Association includes shared by every read method, so the response
 * always has the clinic/medication/warehouse/requester names
 * available without a separate query.
 */
const DEFAULT_INCLUDES = [
    { model: Clinic, as: "clinic" },
    { model: Medication, as: "medication" },
    { model: Warehouse, as: "warehouse" },
    { model: User, as: "requestedBy" },
];

/**
 * This class is the supply request repository.
 * It is the only layer that interacts directly with Sequelize methods.
 */
export class SupplyRequestRepository implements SupplyRequestRepoInterface {

    async create(data: SupplyRequestCreationDto, requestedByUserId: number): Promise<SupplyRequest> {
        return await SupplyRequest.create({
            ...data,
            requestedByUserId,
        });
    }

    async findAllActive(): Promise<SupplyRequest[]> {
        return await SupplyRequest.findAll({ include: DEFAULT_INCLUDES });
    }

    async findHistory(): Promise<SupplyRequest[]> {
        return await SupplyRequest.findAll({
            include: DEFAULT_INCLUDES,
            paranoid: false,
            order: [["createdAt", "DESC"]],
        });
    }

    async findByClinic(clinicId: number): Promise<SupplyRequest[]> {
        return await SupplyRequest.findAll({
            where: { clinicId },
            include: DEFAULT_INCLUDES,
            paranoid: false,
            order: [["createdAt", "DESC"]],
        });
    }

    async findOne(id: number, active: boolean): Promise<SupplyRequest | null> {
        return await SupplyRequest.findOne({
            where: { id },
            paranoid: active,
            include: DEFAULT_INCLUDES,
        });
    }

    async updateStatus(id: number, status: string): Promise<boolean> {
        const [affectedCount] = await SupplyRequest.update(
            { status: status as SupplyRequest["status"] },
            { where: { id } }
        );

        return affectedCount > 0;
    }

    async update(id: number, data: SupplyRequestUpdateDto): Promise<boolean> {
        const [affectedCount] = await SupplyRequest.update(data, { where: { id } });

        return affectedCount > 0;
    }

    async delete(id: number): Promise<boolean> {
        const affectedRow = await SupplyRequest.destroy({ where: { id } });

        return affectedRow > 0;
    }

    async restore(id: number): Promise<void> {
        return await SupplyRequest.restore({ where: { id } });
    }
}
