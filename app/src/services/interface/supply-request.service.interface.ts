import type {
    SupplyRequestCreationDto,
    SupplyRequestStatusUpdateDto,
    SupplyRequestUpdateDto,
    SupplyRequestResponseDto,
} from "../../dto/supply-request.dto.ts";

/**
 * This is the interface for the supply request service class.
 */
export interface SupplyRequestServiceInterface {
    create(data: SupplyRequestCreationDto, requestedByUserId: number): Promise<SupplyRequestResponseDto>;

    findAllActive(): Promise<SupplyRequestResponseDto[]>;

    findHistory(): Promise<SupplyRequestResponseDto[]>;

    findByClinic(clinicId: number): Promise<SupplyRequestResponseDto[]>;

    findOne(id: number): Promise<SupplyRequestResponseDto>;

    updateStatus(id: number, data: SupplyRequestStatusUpdateDto): Promise<SupplyRequestResponseDto>;

    update(id: number, data: SupplyRequestUpdateDto): Promise<SupplyRequestResponseDto>;

    delete(id: number): Promise<boolean>;

    restore(id: number): Promise<SupplyRequestResponseDto>;
}
