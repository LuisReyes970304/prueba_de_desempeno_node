/**
 * Shared, framework-agnostic validation helpers reused by several
 * middlewares, so each one does not redefine the same parsing logic
 * with a slightly different name.
 */

/**
 * Validates that a value is a non-empty string, trimming it.
 *
 * @param {unknown} value - The raw value to validate.
 * @returns {string | null} The trimmed string, or null if invalid.
 */
export function parseNonEmptyString(value: unknown): string | null {
    if (typeof value !== "string" || value.trim().length === 0) {
        return null;
    }

    return value.trim();
}

/**
 * Validates that a value is a positive integer.
 *
 * @param {unknown} value - The raw value to validate.
 * @returns {number | null} The parsed integer, or null if invalid.
 */
export function parsePositiveInteger(value: unknown): number | null {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        return null;
    }

    return parsed;
}
