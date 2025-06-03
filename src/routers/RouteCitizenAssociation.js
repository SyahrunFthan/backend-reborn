import express from 'express';
import {
  createCitizensAssociation,
  deleteCitizenAssociation,
  getCitizensAssocation,
  getCitizensAssocationById,
  updateCitizenAssociation,
} from '../controllers/CitizensAssocation.js';
import verifyToken from '../middlewares/VerivyToken.js';
import verifyRole from '../middlewares/VerifyRole.js';
import validateData from '../middlewares/Validation.js';
import schemaCitizenAssociation from '../validations/SchemaCitizenAssociation.js';
import { deleteCategories } from '../controllers/StallCategories.js';

const router = express.Router();

/**
 * @swagger
 * /citizen-association:
 *   get:
 *     summary: Menampilkan Data RT/RW
 *     tags:
 *       - Citizen Association
 *     responses:
 *       200:
 *         description: Daftar semua RT/RW
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   region_id:
 *                     type: string
 *                   rt_number:
 *                     type: string
 *                   rw_number:
 *                     type: string
 *                   rt_leader:
 *                     type: string
 *                   rw_leader:
 *                     type: string
 *                   total_kk:
 *                     type: integer
 *                   total_population:
 *                     type: integer
 */
router.get(
  '/',
  verifyToken,
  verifyRole(['admin', 'user']),
  getCitizensAssocation
);

/**
 * @swagger
 * /citizen-association/{id}:
 *   get:
 *     summary: Menampilkan Data RT/RW berdasarkan ID
 *     tags:
 *       - Citizen Association
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dari RT/RW yang akan diambil
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data RT/RW ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 region_id:
 *                   type: string
 *                 rt_number:
 *                   type: string
 *                 rw_number:
 *                   type: string
 *                 rt_leader:
 *                   type: string
 *                 rw_leader:
 *                   type: string
 *                 total_kk:
 *                   type: integer
 *                 total_population:
 *                   type: integer
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.get(
  '/:id',
  verifyToken,
  verifyRole(['admin', 'user']),
  getCitizensAssocationById
);

/**
 * @swagger
 * /citizen-association/create:
 *   post:
 *     summary: Menambahkan Data RT/RW
 *     tags:
 *       - Citizen Association
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               region_id:
 *                 type: string
 *                 example: "12345"
 *               rt_number:
 *                 type: string
 *                 example: "001"
 *               rw_number:
 *                 type: string
 *                 example: "002"
 *               rt_leader:
 *                 type: string
 *                 example: "John Doe"
 *               rw_leader:
 *                 type: string
 *                 example: "Jane Smith"
 *               total_kk:
 *                 type: integer
 *                 example: 100
 *               total_population:
 *                 type: integer
 *                 example: 300
 *     responses:
 *       200:
 *         description: Berhasil Menambahkan Data RT/RW
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Terjadi kesalahan server
 */
router.post(
  '/create',
  verifyToken,
  verifyRole(['admin', 'user']),
  validateData(schemaCitizenAssociation),
  createCitizensAssociation
);

/**
 *
 *
 * @swagger
 * /citizen-association/update/{id}:
 *   patch:
 *     summary: Memperbarui Data RT/RW
 *     tags:
 *       - Citizen Association
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dari RT/RW yang akan diperbarui
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               region_id:
 *                 type: string
 *                 example: "12345"
 *               rt_number:
 *                 type: string
 *                 example: "001"
 *               rw_number:
 *                 type: string
 *                 example: "002"
 *               rt_leader:
 *                 type: string
 *                 example: "John Doe"
 *               rw_leader:
 *                 type: string
 *                 example: "Jane Smith"
 *               total_kk:
 *                 type: integer
 *                 example: 100
 *               total_population:
 *                 type: integer
 *                 example: 300
 *     responses:
 *       200:
 *         description: Data RT/RW berhasil diperbarui
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.patch(
  '/update/:id',
  verifyToken,
  verifyRole(['admin']),
  validateData(schemaCitizenAssociation),
  updateCitizenAssociation
);

/**
 * @swagger
 * /citizen-association/delete/{id}:
 *   delete:
 *     summary: Menghapus Data RT/RW
 *     tags:
 *       - Citizen Association
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dari RT/RW yang akan dihapus
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Data RT/RW berhasil dihapus
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */
router.delete(
  '/delete/:id',
  verifyToken,
  verifyRole(['admin']),
  deleteCitizenAssociation
);

export default router;
