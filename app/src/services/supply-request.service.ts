import SupplyRequest from "../models/supply-request.model.ts";
import type {
    SupplyRequestCreationDto,
    SupplyRequestStatusUpdateDto,
    SupplyRequestUpdateDto,
    SupplyRequestResponseDto,
} from "../dto/supply-request.dto.ts";
import { SupplyRequestRepository } from "../repository/supply-request.repository.ts";
import type { SupplyRequestServiceInterface } from "./interface/supply-request.service.interface.ts";

const supplyRequestRepository = new SupplyRequestRepository();

export class SupplyRequestService implements SupplyRequestServiceInterface {

    async create(data: SupplyRequestCreationDto, requestedByUserId: number): Promise<SupplyRequestResponseDto> {
        const created = await supplyRequestRepository.create(data, requestedByUserId);

        const withAssociations = await supplyRequestRepository.findOne(created.id, true);
        if (!withAssociations) {
            throw new Error("Supply request was created but could not be retrieved");
        }

        return this.mapToResponseDto(withAssociations);
    }

    async findAllActive(): Promise<SupplyRequestResponseDto[]> {
        const requests = await supplyRequestRepository.findAllActive();
        return requests.map((request) => this.mapToResponseDto(request));
    }

    async findHistory(): Promise<SupplyRequestResponseDto[]> {
        const requests = await supplyRequestRepository.findHistory();
        return requests.map((request) => this.mapToResponseDto(request));
    }

    async findByClinic(clinicId: number): Promise<SupplyRequestResponseDto[]> {
        const requests = await supplyRequestRepository.findByClinic(clinicId);
        return requests.map((request) => this.mapToResponseDto(request));
    }

    async findOne(id: number): Promise<SupplyRequestResponseDto> {
        const request = await supplyRequestRepository.findOne(id, true);

        if (!request) {
            throw new Error("Supply request not found");
        }

        return this.mapToResponseDto(request);
    }

    async updateStatus(id: number, data: SupplyRequestStatusUpdateDto): Promise<SupplyRequestResponseDto> {
        const affectedCount = await supplyRequestRepository.updateStatus(id, data.status);

        if (!affectedCount) {
            throw new Error("Supply request not found");
        }

        return this.findOne(id);
    }

    async update(id: number, data: SupplyRequestUpdateDto): Promise<SupplyRequestResponseDto> {
        const affectedCount = await supplyRequestRepository.update(id, data);

        if (!affectedCount) {
            throw new Error("Supply request not found");
        }

        return this.findOne(id);
    }

    async delete(id: number): Promise<boolean> {
        const deleted = await supplyRequestRepository.delete(id);

        if (!deleted) {
            throw new Error("Supply request not found or already deleted");
        }

        return deleted;
    }

    async restore(id: number): Promise<SupplyRequestResponseDto> {
        const request = await supplyRequestRepository.findOne(id, false);

        if (!request) {
            throw new Error("Supply request not found");
        }

        await supplyRequestRepository.restore(id);

        return this.findOne(id);
    }

    /**
     * Maps a raw Sequelize SupplyRequest (with its associations
     * eager-loaded) into the compact response shape: the medication
     * name at the top level, plus small { id, name } objects for the
     * clinic, warehouse and requester, instead of dumping every
     * column of every related row.
     */
    private mapToResponseDto(request: SupplyRequest): SupplyRequestResponseDto {
        if (!request.medication || !request.clinic || !request.warehouse || !request.requestedBy) {
            throw new Error("Supply request associations were not loaded");
        }

        return {
            id: request.id,
            name: request.medication.name,
            quantity: request.quantity,
            status: request.status,
            clinic: { id: request.clinic.id, name: request.clinic.name },
            warehouse: { id: request.warehouse.id, name: request.warehouse.name },
            requestedBy: { id: request.requestedBy.id, name: request.requestedBy.name },
            createdAt: request.createdAt,
            updatedAt: request.updatedAt,
            deletedAt: request.deletedAt ?? null,
        };
    }
}
