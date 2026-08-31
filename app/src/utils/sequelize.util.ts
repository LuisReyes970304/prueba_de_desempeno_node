import type { Model, ModelStatic } from "sequelize";

/**
 * Performs a partial update against a Sequelize model.
 *
 * Sequelize's own `Model.update()` always reports `affectedCount: 0`
 * when called with an empty payload (there is nothing to SET), even
 * if a row with that id genuinely exists. Every repository in this
 * project used that count to decide whether to respond 404, which
 * meant a PUT/PATCH with an empty body incorrectly looked like
 * "not found" for a row that was actually there.
 *
 * This helper centralizes the fix once: an empty payload is treated
 * as a no-op success (true) as long as the row exists, instead of
 * duplicating the same guard in every repository's update() method.
 *
 * @param {ModelStatic<M>} model - The Sequelize model to update.
 * @param {number} id - Primary key of the row to update.
 * @param {object} data - Partial attributes to set.
 * @returns {Promise<boolean>} True if the row exists (and was updated when data was non-empty).
 */
export async function updatePartial<M extends Model>(
    model: ModelStatic<M>,
    id: number,
    data: object,
): Promise<boolean> {
    if (Object.keys(data).length === 0) {
        const existing = await model.findByPk(id);
        return existing !== null;
    }

    const [affectedCount] = await model.update(data as never, {
        where: { id } as never,
    });

    return affectedCount > 0;
}
