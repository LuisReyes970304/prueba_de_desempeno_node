import type { Response } from "express";

/**
 * Base class shared by every controller in the application.
 * Centralizes the two pieces of logic every controller repeated
 * on its own: validating a numeric route param, and translating a
 * thrown service error into the right HTTP status code.
 */
export abstract class BaseController {

    /**
     * Validates that a route param is a positive integer ID.
     * Responds with 400 and returns null if it is not.
     *
     * @param {unknown} id - The raw route param (always a string from Express).
     * @param {Response} res - Used to send the 400 response on failure.
     * @param {string} label - Human-readable name used in the error message (e.g. "clinic ID").
     * @returns {number | null} The parsed ID, or null if invalid (response already sent).
     */
    protected validateId(id: unknown, res: Response, label: string): number | null {
        const parsedId = Number(id);

        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            res.status(400).json({ error: `Invalid or missing ${label}` });
            return null;
        }

        return parsedId;
    }

    /**
     * Translates a thrown service/repository error into an HTTP
     * response. Error messages containing "not found" become 404;
     * a Sequelize unique constraint violation becomes 409 (using
     * uniqueConstraintMessage, when provided); everything else
     * falls back to defaultStatus.
     *
     * @param {Response} res - Used to send the response.
     * @param {unknown} error - The error thrown by the service layer.
     * @param {number} defaultStatus - Status used when the error does not match a known case.
     * @param {object} [options] - Optional overrides.
     * @param {string} [options.defaultMsg] - Message used when the error has no message.
     * @param {string} [options.uniqueConstraintMessage] - Message used for a unique constraint violation (mapped to 409).
     */
    protected handleError(
        res: Response,
        error: unknown,
        defaultStatus: number,
        options?: { defaultMsg?: string; uniqueConstraintMessage?: string }
    ): void {
        const isUniqueConstraintError =
            options?.uniqueConstraintMessage !== undefined &&
            error !== null &&
            typeof error === "object" &&
            "name" in error &&
            (error as { name: unknown }).name === "SequelizeUniqueConstraintError";

        if (isUniqueConstraintError) {
            res.status(409).json({ error: options!.uniqueConstraintMessage });
            return;
        }

        const message = error instanceof Error ? error.message : options?.defaultMsg ?? "An unexpected error occurred";
        const status = message.toLowerCase().includes("not found") ? 404 : defaultStatus;

        res.status(status).json({ error: message });
    }
}
