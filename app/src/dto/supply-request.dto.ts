import type { RequestStatus } from "../models/supply-request.model.ts";

/**
 * Data required to create a supply request. The status is never
 * supplied by the client: every new request starts as "pending"
 * and can only change through the dedicated status-update endpoint.
 */
export interface SupplyRequestCreationDto {
    clinicId: number;
    medicationId: number;
    warehouseId: number;
    quantity: number;
}

/**
 * Data allowed when updating the status of an existing request.
 */
export interface SupplyRequestStatusUpdateDto {
    status: RequestStatus;
}

/**
 * Data allowed on a full admin update of a request (beyond status).
 */
export interface SupplyRequestUpdateDto {
    clinicId?: number;
    medicationId?: number;
    warehouseId?: number;
    quantity?: number;
}

/**
 * Compact shape returned to clients: instead of dumping full nested
 * rows for every association, only the fields actually useful to
 * display are included.
 */
export interface SupplyRequestResponseDto {
    id: number;
    name: string;
    quantity: number;
    status: RequestStatus;
    clinic: { id: number; name: string };
    warehouse: { id: number; name: string };
    requestedBy: { id: number; name: string };
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
