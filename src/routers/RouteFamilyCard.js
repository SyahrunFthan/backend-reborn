import express from 'express';
import validateData from '../middlewares/Validation.js';
import {
  createFamilyCard,
  deleteFamilyCard,
  updateFamilyCard,
  getFamilyCard,
} from '../controllers/FamilyCard.js';
import { schemaFamilyCard } from '../validations/SchemaFamilyCard.js';
import verifyToken from '../middlewares/VerivyToken.js';

const router = express.Router();

router.get('/', verifyToken, getFamilyCard);
router.post(
  '/create/:id',
  verifyToken,
  validateData(schemaFamilyCard),
  createFamilyCard
);
router.patch(
  '/update/:id/:id_user',
  verifyToken,
  validateData(schemaFamilyCard),
  updateFamilyCard
);
router.delete(
  '/delete/:id',
  verifyToken,
  validateData(schemaFamilyCard),
  deleteFamilyCard
);

export default router;
