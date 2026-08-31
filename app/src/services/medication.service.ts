import Medication from "../models/medication.model.ts";
import type { MedicationCreationDto, MedicationUpdateDto } from "../dto/medication.dto.ts";
import { MedicationRepository } from "../repository/medication.repository.ts";
import type { MedicationServiceInterface } from "./interface/medication.service.interface.ts";

const medicationRepository = new MedicationRepository();

export class MedicationService implements MedicationServiceInterface {

    async create(data: MedicationCreationDto): Promise<Medication> {
        if (!data) {
            throw new Error("medication data is required");
        }

        return await medicationRepository.create(data);
    }

    async findAll(): Promise<Medication[]> {
        return await medicationRepository.findAll();
    }

    async findOne(id: number): Promise<Medication> {
        const medication = await medicationRepository.findOne(id, true);

        if (!medication) {
            throw new Error("Medication not found");
        }

        return medication;
    }

    async update(id: number, data: MedicationUpdateDto): Promise<Medication> {
        const affectedCount = await medicationRepository.update(id, data);

        if (!affectedCount) {
            throw new Error("Medication not found");
        }

        const medicationUpdated = await medicationRepository.findOne(id, true);

        if (!medicationUpdated) {
            throw new Error("Medication was updated but could not be retrieved");
        }

        return medicationUpdated;
    }

    async delete(id: number): Promise<boolean> {
        const medicationDeleted = await medicationRepository.delete(id);

        if (!medicationDeleted) {
            throw new Error("Medication not found or already deleted");
        }

        return medicationDeleted;
    }

    async restore(id: number): Promise<Medication> {
        const medication = await medicationRepository.findOne(id, false);

        if (!medication) {
            throw new Error("Medication not found");
        }

        await medicationRepository.restore(id);

        return medication;
    }
}
