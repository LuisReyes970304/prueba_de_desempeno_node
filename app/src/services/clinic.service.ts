import Clinic from "../models/clinic.model.ts";
import type {
    ClinicCreationDto,
    ClinicUpdateDto
} from "../dto/clinic.dto.ts";
import { ClinicRepository } from "../repository/clinic.repository.ts";
import type { ClinicServiceInterface } from "./interface/clinic.service.interface.ts";

const clinicRepository = new ClinicRepository();

export class ClinicService implements ClinicServiceInterface {

    async create(data: ClinicCreationDto): Promise<Clinic> {
        if (!data) {
            throw new Error("clinic data is required");
        }

        return await clinicRepository.create(data);
    }

    async findAll(): Promise<Clinic[]> {
        const clinicsList = await clinicRepository.findAll();
        return clinicsList;
    }

    async findOne(id: number): Promise<Clinic> {
        const clinic = await clinicRepository.findOne(id, true);

        if (!clinic) {
            throw new Error("Clinic not found");
        }

        return clinic;
    }

    async findByNit(nit: number): Promise<Clinic> {
        const clinic = await clinicRepository.findByNit(nit);

        if (!clinic) {
            throw new Error("Clinic not found");
        }

        return clinic;
    }

    async update(id: number, data: ClinicUpdateDto): Promise<Clinic> {
        const affectedCount = await clinicRepository.update(id, data);

        if (!affectedCount) {
            throw new Error("Clinic not found");
        }

        const clinicUpdated = await clinicRepository.findOne(id, true);

        if (!clinicUpdated) {
            throw new Error("Clinic was updated but could not be retrieved");
        }

        return clinicUpdated;
    }

    async delete(id: number): Promise<boolean> {
        const clinicDeleted = await clinicRepository.delete(id);

        if (!clinicDeleted) {
            throw new Error("Clinic not found or already deleted");
        }

        return clinicDeleted;
    }

    async restore(id: number): Promise<Clinic> {
        const clinic = await clinicRepository.findOne(id, false);

        if (!clinic) {
            throw new Error("Clinic not found");
        }

        await clinicRepository.restore(id);

        return clinic;
    }
}
