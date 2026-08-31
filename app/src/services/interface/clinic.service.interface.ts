import Clinic from "../../models/clinic.model.ts";
import type {
    ClinicCreationDto,
    ClinicUpdateDto
} from "../../dto/clinic.dto.ts";

/**
 * This is the interface for the clinic service class.
 */
export interface ClinicServiceInterface {

    create(data: ClinicCreationDto): Promise<Clinic>;

    findAll(): Promise<Clinic[]>;

    findOne(id: number): Promise<Clinic>;

    findByNit(id: number): Promise<Clinic>;

    update(id: number, data: ClinicUpdateDto): Promise<Clinic>;

    delete(id: number): Promise<boolean>;

    restore(id: number): Promise<Clinic>;
}
