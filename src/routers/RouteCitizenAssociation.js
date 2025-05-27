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

router.get(
  '/',
  verifyToken,
  verifyRole(['admin', 'user']),
  getCitizensAssocation
);
router.get(
  '/:id',
  verifyToken,
  verifyRole(['admin', 'user']),
  getCitizensAssocationById
);
router.post(
  '/create',
  verifyToken,
  verifyRole(['admin']),
  validateData(schemaCitizenAssociation),
  createCitizensAssociation
);
router.patch(
  '/update/:id',
  verifyToken,
  verifyRole(['admin']),
  validateData(schemaCitizenAssociation),
  updateCitizenAssociation
);
router.delete(
  '/delete/:id',
  verifyToken,
  verifyRole(['admin']),
  deleteCitizenAssociation
);

export default router;
