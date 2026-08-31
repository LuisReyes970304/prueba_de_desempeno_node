/**
 * Data required to create a medication in the catalog.
 */
export interface MedicationCreationDto {
    name: string;
    description: string;
    unit: string;
}

/**
 * Data allowed to update an existing medication.
 */
export interface MedicationUpdateDto {
    name?: string;
    description?: string;
    unit?: string;
}
