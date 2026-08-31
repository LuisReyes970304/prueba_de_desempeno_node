/**
 * This is the DTO needed for the creation.
 */
export interface ClinicCreationDto {
    name: string;
    nit: string;
    address: string;
    phone: string;
}

/**
 * THis is the DTO used for updating a clinic
 */
export interface ClinicUpdateDto {
    name?: string;
    nit?: string;
    address?: string;
    phone?: string;
}