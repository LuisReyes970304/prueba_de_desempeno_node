import { Router } from "express";
import { clinicController } from "../controllers/clinic.controller.ts";
import { verifyToken, authorizeRoles } from "../middleware/auth.middleware.ts";
import { validateNitOnCreate, validateNitOnUpdate } from "../middleware/clinic.middleware.ts";

const router = Router();

/**
 * @openapi
 * /api/clinicas:
 *   post:
 *     summary: Crear clínica
 *     description: Crea una nueva clínica. Solo el rol "admin" puede hacerlo. Valida mediante middleware que el NIT no exista previamente (incluyendo clínicas eliminadas lógicamente).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clinicas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - nit
 *               - phone
 *               - address
 *               - responsibleName
 *             properties:
 *               name:
 *                 type: string
 *                 example: Clínica Central
 *               nit:
 *                 type: integer
 *                 example: 900123456
 *               phone:
 *                 type: integer
 *                 example: 3025949098
 *               address:
 *                 type: string
 *                 example: Calle 45 # 12-30, Bogotá
 *               responsibleName:
 *                 type: string
 *                 example: Dra. María Fernanda Gómez
 *     responses:
 *       201:
 *         description: Clínica creada exitosamente.
 *       400:
 *         description: Body inválido.
 *       401:
 *         description: Token faltante o inválido.
 *       403:
 *         description: El usuario autenticado no tiene rol admin.
 *       409:
 *         description: Ya existe una clínica con ese NIT.
 */
router.post(
    "/",
    verifyToken,
    authorizeRoles("admin"),
    validateNitOnCreate,
    clinicController.createClinic
);

/**
 * @openapi
 * /api/clinicas:
 *   get:
 *     summary: Listar clínicas activas
 *     description: Lista todas las clínicas activas (excluye las eliminadas lógicamente). Accesible para cualquier usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clinicas
 *     responses:
 *       200:
 *         description: Clínicas devueltas exitosamente.
 *       401:
 *         description: Token faltante o inválido.
 */
router.get("/", verifyToken, clinicController.findAllClinics);

/**
 * @openapi
 * /api/clinicas/{id}:
 *   get:
 *     summary: Obtener clínica por ID
 *     description: Obtiene el detalle de una clínica activa por su ID. Accesible para cualquier usuario autenticado.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clinicas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la clínica.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Clínica devuelta exitosamente.
 *       400:
 *         description: ID inválido o faltante.
 *       401:
 *         description: Token faltante o inválido.
 *       404:
 *         description: Clínica no encontrada.
 */
router.get("/:id", verifyToken, clinicController.findOneClinic);

/**
 * @openapi
 * /api/clinicas/{id}:
 *   put:
 *     summary: Actualizar clínica
 *     description: Actualiza los datos de la clínica. Solo el rol "admin" puede hacerlo. Valida mediante middleware que el NIT (si se envía) no choque con el de otra clínica existente.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clinicas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la clínica a actualizar.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Clínica Central Actualizada
 *               nit:
 *                 type: integer
 *                 example: 900987654
 *               phone:
 *                 type: integer
 *                 example: 3025949098
 *               address:
 *                 type: string
 *                 example: Carrera 10 # 20-15, Bogotá
 *               responsibleName:
 *                 type: string
 *                 example: Dr. Carlos Andrés Pérez
 *     responses:
 *       200:
 *         description: Clínica actualizada exitosamente.
 *       400:
 *         description: ID o body inválido.
 *       401:
 *         description: Token faltante o inválido.
 *       403:
 *         description: El usuario autenticado no tiene rol admin.
 *       404:
 *         description: Clínica no encontrada.
 *       409:
 *         description: El NIT ya pertenece a otra clínica.
 */
router.put(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    validateNitOnUpdate,
    clinicController.updateClinic
);

/**
 * @openapi
 * /api/clinicas/{id}:
 *   delete:
 *     summary: Eliminar clínica (lógico)
 *     description: Elimina lógicamente una clínica (paranoid en Sequelize). Solo el rol "admin" puede hacerlo. La clínica no se borra físicamente y puede restaurarse.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clinicas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la clínica a eliminar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Clínica eliminada exitosamente (soft-delete).
 *       400:
 *         description: ID inválido o faltante.
 *       401:
 *         description: Token faltante o inválido.
 *       403:
 *         description: El usuario autenticado no tiene rol admin.
 *       404:
 *         description: Clínica no encontrada o ya eliminada.
 */
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("admin"),
    clinicController.deleteClinic
);

/**
 * @openapi
 * /api/clinicas/{id}/restore:
 *   patch:
 *     summary: Restaurar clínica eliminada
 *     description: Restaura una clínica previamente eliminada de forma lógica. Solo el rol "admin" puede hacerlo.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Clinicas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la clínica a restaurar.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Clínica restaurada exitosamente.
 *       400:
 *         description: ID inválido o faltante.
 *       401:
 *         description: Token faltante o inválido.
 *       403:
 *         description: El usuario autenticado no tiene rol admin.
 *       404:
 *         description: Clínica no encontrada.
 */
router.patch(
    "/:id/restore",
    verifyToken,
    authorizeRoles("admin"),
    clinicController.restoreClinic
);

export default router;