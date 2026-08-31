import multer from "multer";
import type { Request } from "express";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB, plenty for a seed data file.

/**
 * Files are kept in memory (not written to disk) since they are
 * small JSON payloads that only need to be parsed once and discarded.
 */
const storage = multer.memoryStorage();

/**
 * Accepts only files that look like JSON, either by MIME type or
 * by extension (some browsers/clients send "application/octet-stream"
 * for .json files depending on how they were selected).
 */
function jsonFileFilter(
    _req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
): void {
    const isJsonMimeType = file.mimetype === "application/json";
    const isJsonExtension = file.originalname.toLowerCase().endsWith(".json");

    if (isJsonMimeType || isJsonExtension) {
        callback(null, true);
        return;
    }

    const error = new Error("Only .json files are allowed") as Error & { status: number };
    error.status = 400;
    callback(error);
}

/**
 * Multer middleware for a single JSON file upload under the
 * form field name "file". Used by the seed upload endpoint.
 */
export const uploadJsonFile = multer({
    storage,
    fileFilter: jsonFileFilter,
    limits: { fileSize: MAX_FILE_SIZE_BYTES },
}).single("file");
