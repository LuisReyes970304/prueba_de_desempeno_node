/**
 * Shape of a single user entry inside the uploaded seed JSON file.
 */
export interface UserSeedEntry {
    name: string;
    email: string;
    password: string;
    role: string;
}

/**
 * Shape of a single clinic entry inside the uploaded seed JSON file.
 */
export interface ClinicSeedEntry {
    name: string;
    nit: number;
    address: string;
    phone: number;
    responsibleName: string;
}

/**
 * Shape of a single warehouse entry inside the uploaded seed JSON file.
 */
export interface WarehouseSeedEntry {
    name: string;
    location: string;
    phone: number;
}

/**
 * Shape of a single medication entry inside the uploaded seed JSON file.
 */
export interface MedicationSeedEntry {
    name: string;
    description: string;
    unit: string;
}

/**
 * Full shape of the JSON file accepted by the seed upload endpoint.
 * Every section is optional, so a single file can seed one or
 * several entities at once.
 */
export interface SeedFileDto {
    users?: UserSeedEntry[];
    clinics?: ClinicSeedEntry[];
    warehouses?: WarehouseSeedEntry[];
    medications?: MedicationSeedEntry[];
}

/**
 * Result of seeding a single entity type: how many rows were
 * created, how many were skipped because they already existed,
 * and the list of row-level errors (if any), so a single bad row
 * does not abort the whole batch.
 */
export interface SeedEntityResult {
    created: number;
    skipped: number;
    errors: string[];
}

/**
 * Full summary returned by the seed upload endpoint, one
 * SeedEntityResult per entity type that was present in the file.
 */
export interface SeedSummaryDto {
    users?: SeedEntityResult;
    clinics?: SeedEntityResult;
    warehouses?: SeedEntityResult;
    medications?: SeedEntityResult;
}
