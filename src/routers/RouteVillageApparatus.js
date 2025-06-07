import express from 'express';
import validateData from '../middlewares/Validation.js';
import {
  createVillageApparatus,
  deleteVillageApparatus,
  getVillageApparaturForRegionForm,
  getVillageApparatus,
  getVillageApparatusById,
  updateVillageApparatus,
} from '../controllers/VillageApparatus.js';
import { schemaVillageApparatus } from '../validations/SchemaVillageApparatus.js';
import verifyToken from '../middlewares/VerivyToken.js';
import verifyRole from '../middlewares/VerifyRole.js';

const router = express.Router();

router.get('/', verifyToken, verifyRole(['admin']), getVillageApparatus);
router.get(
  '/region-form',
  verifyToken,
  verifyRole(['admin']),
  getVillageApparaturForRegionForm
);
router.get('/:id', verifyToken, verifyRole(['admin']), getVillageApparatusById);
router.post(
  '/create',
  verifyToken,
  verifyRole(['superadmin', 'admin']),
  validateData(schemaVillageApparatus),
  createVillageApparatus
);
router.patch(
  '/update/:id_user/:id',
  verifyToken,
  verifyRole(['superadmin', 'admin']),
  validateData(schemaVillageApparatus),
  updateVillageApparatus
);
router.delete(
  '/delete/:id',
  verifyToken,
  verifyRole(['superadmin', 'admin']),
  deleteVillageApparatus
);

export default router;
