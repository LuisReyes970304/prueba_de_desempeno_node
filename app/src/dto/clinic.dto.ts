/**
 * This is the DTO needed for the creation.
 */
export interface ClinicCreationDto {
    name: string;
    nit: number;
    address: string;
    phone: number;
}

/**
 * THis is the DTO used for updating a clinic
 */
export interface ClinicUpdateDto {
    name?: string;
    nit?: number;
    address?: string;
    phone?: number;
}