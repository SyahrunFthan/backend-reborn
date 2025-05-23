import express from 'express';
import validateData from '../middlewares/Validation.js';
import {
  createVillageApparatus,
  deleteVillageApparatus,
  updateVillageApparatus,
} from '../controllers/VillageApparatus.js';
import { schemaVillageApparatus } from '../validations/SchemaVillageApparatus.js';
import verifyToken from '../middlewares/VerivyToken.js';
import verifyRole from '../middlewares/VerifyRole.js';

const router = express.Router();

router.post(
  '/create/:id',
  // verifyToken,
  // verifyRole(['superadmin', 'admin']),
  validateData(schemaVillageApparatus),
  createVillageApparatus
);
router.patch(
  '/update/:id_user/:id',
  // verifyToken,
  // verifyRole(['superadmin', 'admin']),
  validateData(schemaVillageApparatus),
  updateVillageApparatus
);
router.delete(
  '/delete/:id',
  // verifyToken,
  // verifyRole(["superadmin", "admin"]),
  deleteVillageApparatus
);

export default router;
