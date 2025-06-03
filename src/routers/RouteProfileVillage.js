import express from 'express';
import validateData from '../middlewares/Validation.js';
import {
  createProfileVillage,
  deleteProfileVillage,
  getProfileVillage,
  updateProfileVillage,
} from '../controllers/ProfileVillage.js';
import { schemaProfileVillage } from '../validations/SchemaProfileVillage.js';
import verifyToken from '../middlewares/VerivyToken.js';
import verifyRole from '../middlewares/VerifyRole.js';

const router = express.Router();

router.get('/', getProfileVillage);
router.post(
  '/create',
  // verifyToken,
  // verifyRole(['admin']),
  validateData(schemaProfileVillage),
  createProfileVillage
);
router.patch(
  '/update/:id',
  verifyToken,
  verifyRole(['admin']),
  validateData(schemaProfileVillage),
  updateProfileVillage
);
router.delete(
  '/delete/:id',
  verifyToken,
  verifyRole(['superadmin', 'admin']),
  deleteProfileVillage
);

export default router;
