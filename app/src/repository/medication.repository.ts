import type { MedicationRepoInterface } from "./interface/medication.repository.interface.ts";
import Medication from "../models/medication.model.ts";
import type { MedicationCreationDto, MedicationUpdateDto } from "../dto/medication.dto.ts";
import { updatePartial } from "../utils/sequelize.util.ts";

/**
 * This class is the medication repository.
 * It is the only layer that interacts directly with Sequelize methods.
 */
export class MedicationRepository implements MedicationRepoInterface {

    async create(data: MedicationCreationDto): Promise<Medication> {
        return await Medication.create(data);
    }

    async findAll(): Promise<Medication[]> {
        return await Medication.findAll();
    }

    async findOne(id: number, active: boolean): Promise<Medication | null> {
        return await Medication.findOne({
            where: { id },
            paranoid: active
        });
    }

    async findByName(name: string): Promise<Medication | null> {
        return await Medication.findOne({
            where: { name },
            paranoid: false
        });
    }

    async update(id: number, data: MedicationUpdateDto): Promise<boolean> {
        return await updatePartial(Medication, id, data);
    }

    async delete(id: number): Promise<boolean> {
        const affectedRow = await Medication.destroy({
            where: { id }
        });

        return affectedRow > 0;
    }

    async restore(id: number): Promise<void> {
        return await Medication.restore({
            where: { id }
        });
    }
}
