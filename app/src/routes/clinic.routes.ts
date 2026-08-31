import { Router } from "express";
import { clinicController } from "../controllers/clinic.controller.ts";

const router = Router();

/**
 * @openapi
 * /clinic/create_clinic:
 *   post:
 *     summary: Create new clinic!
 *     description: Create a new clinic using a body request.
 *     tags:
 *       - Clinics
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
 *     responses:
 *       201:
 *         description: New clinic created.
 *       400:
 *         description: Invalid request body.
 */
router.post("/create_clinic", clinicController.createClinic);

/**
 * @openapi
 * /clinic/get_clinics:
 *   get:
 *     summary: Get all clinics!
 *     description: Get all clinics in the database.
 *     tags:
 *       - Clinics
 *     responses:
 *       200:
 *         description: Clinics returned successfully.
 *       500:
 *         description: Unexpected server error.
 */
router.get("/get_clinics", clinicController.findAllClinics);

/**
 * @openapi
 * /clinic/get_clinic/{id}:
 *   get:
 *     summary: Get clinic by ID
 *     description: Get an existing clinic using its ID.
 *     tags:
 *       - Clinics
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the clinic.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Clinic returned successfully.
 *       400:
 *         description: Invalid or missing clinic ID.
 *       404:
 *         description: Clinic not found.
 */
router.get("/get_clinic/:id", clinicController.findOneClinic);

/**
 * @openapi
 * /clinic/get_clinic_by_nit/{nit}:
 *   get:
 *     summary: Get clinic by NIT
 *     description: Get an existing clinic using its NIT.
 *     tags:
 *       - Clinics
 *     parameters:
 *       - in: path
 *         name: nit
 *         required: true
 *         description: NIT of the clinic.
 *         schema:
 *           type: integer
 *           example: 900123456
 *     responses:
 *       200:
 *         description: Clinic returned successfully.
 *       400:
 *         description: Invalid or missing clinic NIT.
 *       404:
 *         description: Clinic not found.
 */
router.get("/get_clinic_by_nit/:nit", clinicController.findClinicByNit);

/**
 * @openapi
 * /clinic/update_clinic/{id}:
 *   patch:
 *     summary: Update clinic
 *     description: Update an existing clinic using its ID and request body.
 *     tags:
 *       - Clinics
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the clinic to update.
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
 *                 example: Clínica Central Updated
 *               nit:
 *                 type: integer
 *                 example: 900987654
 *     responses:
 *       200:
 *         description: Clinic updated successfully.
 *       400:
 *         description: Invalid clinic ID or request body.
 *       404:
 *         description: Clinic not found.
 */
router.patch("/update_clinic/:id", clinicController.updateClinic);

/**
 * @openapi
 * /clinic/delete/{id}:
 *   delete:
 *     summary: Delete clinic by ID
 *     description: Soft-delete an existing clinic using its ID.
 *     tags:
 *       - Clinics
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the clinic to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Clinic deleted successfully.
 *       400:
 *         description: Invalid or missing clinic ID.
 *       404:
 *         description: Clinic not found.
 */
router.delete("/delete/:id", clinicController.deleteClinic);

/**
 * @openapi
 * /clinic/restore/{id}:
 *   patch:
 *     summary: Restore clinic by ID
 *     description: Restore a soft-deleted clinic using its ID.
 *     tags:
 *       - Clinics
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the clinic to restore.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Clinic restored successfully.
 *       400:
 *         description: Invalid or missing clinic ID.
 *       404:
 *         description: Clinic not found.
 */
router.patch("/restore/:id", clinicController.restoreClinic);

export default router;

