import Medication from "../../models/medication.model.ts";
import type { MedicationCreationDto, MedicationUpdateDto } from "../../dto/medication.dto.ts";

/**
 * This is the interface for the medication service class.
 */
export interface MedicationServiceInterface {
    create(data: MedicationCreationDto): Promise<Medication>;

    findAll(): Promise<Medication[]>;

    findOne(id: number): Promise<Medication>;

    update(id: number, data: MedicationUpdateDto): Promise<Medication>;

    delete(id: number): Promise<boolean>;

    restore(id: number): Promise<Medication>;
}
