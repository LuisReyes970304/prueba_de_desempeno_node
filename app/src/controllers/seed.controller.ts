import type { Request, Response } from "express";
import { DatabaseSeederService } from "../services/database-seeder.service.ts";
import type { SeedFileDto } from "../dto/seed.dto.ts";

class SeedController {
    /**
     *
     * @param seederService - Inject of DatabaseSeederService dependency
     * allowing better testing in the future.
     */
    constructor(private seederService: DatabaseSeederService = new DatabaseSeederService()) {
        this.uploadSeedFile = this.uploadSeedFile.bind(this);
    }

    /**
     * Handles the upload of a JSON seed file (via multer) and uses
     * its content to populate the database.
     */
    uploadSeedFile = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.file) {
                res.status(400).json({ error: "No file was uploaded. Send it under the 'file' field." });
                return;
            }

            const parsedData = this.parseJsonFile(req.file.buffer, res);
            if (parsedData === null) return;

            const summary = await this.seederService.seedFromFile(parsedData);
            res.status(200).json({ message: "Seed file processed successfully", summary });
        } catch (error) {
            res.status(500).json({
                error: error instanceof Error ? error.message : "Unexpected error processing the seed file",
            });
        }
    };

    /**
     * Helper that safely parses the uploaded file buffer as JSON,
     * responding with 400 and returning null if it's not valid JSON
     * or does not contain at least one recognized section.
     */
    private parseJsonFile(buffer: Buffer, res: Response): SeedFileDto | null {
        let parsed: unknown;

        try {
            parsed = JSON.parse(buffer.toString("utf-8"));
        } catch {
            res.status(400).json({ error: "The uploaded file is not valid JSON" });
            return null;
        }

        if (typeof parsed !== "object" || parsed === null) {
            res.status(400).json({ error: "The uploaded JSON must be an object" });
            return null;
        }

        const data = parsed as SeedFileDto;
        const hasAnySection = Boolean(data.users || data.clinics || data.warehouses || data.medications);

        if (!hasAnySection) {
            res.status(400).json({
                error: "The JSON file must include at least one of: users, clinics, warehouses, medications",
            });
            return null;
        }

        return data;
    }
}

export const seedController = new SeedController();
