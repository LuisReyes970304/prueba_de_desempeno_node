import User from "../models/user.model.ts";
import Clinic from "../models/clinic.model.ts";
import Warehouse from "../models/werehouse.model.ts";
import Medication from "../models/medication.model.ts";
import { passwordManager } from "../utils/bcrypt.util.ts";
import { ALLOWED_ROLES } from "./users.service.ts";
import type {
    SeedFileDto,
    SeedSummaryDto,
    SeedEntityResult,
    UserSeedEntry,
    ClinicSeedEntry,
    WarehouseSeedEntry,
    MedicationSeedEntry,
} from "../dto/seed.dto.ts";

/**
 * This service reads a parsed JSON seed file and populates the
 * database with its content. It acts as the endpoint-driven
 * counterpart of the "npm run seed" script: instead of a fixed
 * list of users, an admin can upload a JSON file with the data
 * to load for users, clinics, warehouses and medications.
 *
 * Every entity type is seeded independently and idempotently
 * (matched by a natural unique key), and a single invalid row
 * never aborts the rest of the batch: it is recorded in the
 * "errors" list of that entity's result instead.
 */
export class DatabaseSeederService {

    /**
     * Seeds every entity section present in the uploaded file.
     *
     * @param {SeedFileDto} data - Parsed content of the uploaded JSON file.
     * @returns {Promise<SeedSummaryDto>} A summary of created/skipped rows and errors, per entity.
     */
    async seedFromFile(data: SeedFileDto): Promise<SeedSummaryDto> {
        const summary: SeedSummaryDto = {};

        if (data.users) {
            summary.users = await this.seedUsers(data.users);
        }

        if (data.clinics) {
            summary.clinics = await this.seedClinics(data.clinics);
        }

        if (data.warehouses) {
            summary.warehouses = await this.seedWarehouses(data.warehouses);
        }

        if (data.medications) {
            summary.medications = await this.seedMedications(data.medications);
        }

        return summary;
    }

    private async seedUsers(entries: UserSeedEntry[]): Promise<SeedEntityResult> {
        const result: SeedEntityResult = { created: 0, skipped: 0, errors: [] };

        for (const [index, entry] of entries.entries()) {
            try {
                if (!ALLOWED_ROLES.includes(entry.role as typeof ALLOWED_ROLES[number])) {
                    throw new Error(`Invalid role "${entry.role}". Allowed roles are: ${ALLOWED_ROLES.join(", ")}`);
                }

                const [, created] = await User.findOrCreate({
                    where: { email: entry.email },
                    defaults: {
                        name: entry.name,
                        email: entry.email,
                        password: await passwordManager.passwordHasher(entry.password),
                        role: entry.role,
                    },
                });

                created ? result.created++ : result.skipped++;
            } catch (error) {
                result.errors.push(this.describeRowError(index, error));
            }
        }

        return result;
    }

    private async seedClinics(entries: ClinicSeedEntry[]): Promise<SeedEntityResult> {
        const result: SeedEntityResult = { created: 0, skipped: 0, errors: [] };

        for (const [index, entry] of entries.entries()) {
            try {
                const [, created] = await Clinic.findOrCreate({
                    where: { nit: entry.nit },
                    defaults: {
                        name: entry.name,
                        nit: entry.nit,
                        address: entry.address,
                        phone: entry.phone,
                        responsibleName: entry.responsibleName,
                    },
                });

                created ? result.created++ : result.skipped++;
            } catch (error) {
                result.errors.push(this.describeRowError(index, error));
            }
        }

        return result;
    }

    private async seedWarehouses(entries: WarehouseSeedEntry[]): Promise<SeedEntityResult> {
        const result: SeedEntityResult = { created: 0, skipped: 0, errors: [] };

        for (const [index, entry] of entries.entries()) {
            try {
                const [, created] = await Warehouse.findOrCreate({
                    where: { name: entry.name },
                    defaults: {
                        name: entry.name,
                        location: entry.location,
                        phone: entry.phone,
                    },
                });

                created ? result.created++ : result.skipped++;
            } catch (error) {
                result.errors.push(this.describeRowError(index, error));
            }
        }

        return result;
    }

    private async seedMedications(entries: MedicationSeedEntry[]): Promise<SeedEntityResult> {
        const result: SeedEntityResult = { created: 0, skipped: 0, errors: [] };

        for (const [index, entry] of entries.entries()) {
            try {
                const [, created] = await Medication.findOrCreate({
                    where: { name: entry.name },
                    defaults: {
                        name: entry.name,
                        description: entry.description,
                        unit: entry.unit,
                    },
                });

                created ? result.created++ : result.skipped++;
            } catch (error) {
                result.errors.push(this.describeRowError(index, error));
            }
        }

        return result;
    }

    /**
     * Helper that formats a row-level error message with its index,
     * so the caller can locate which entry in the JSON file failed.
     */
    private describeRowError(index: number, error: unknown): string {
        const message = error instanceof Error ? error.message : "Unknown error";
        return `Row ${index}: ${message}`;
    }
}
