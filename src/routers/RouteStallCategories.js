import express from 'express';
import validateData from '../middlewares/Validation.js';
import {
  createStallCategories,
  updateStallCategories,
  deleteCategories,
  getStallCategories,
} from '../controllers/StallCategories.js';
import { schemaStallCategories } from '../validations/SchemaStallCategories.js';
import verifyToken from '../middlewares/VerivyToken.js';
import verifyRole from '../middlewares/VerifyRole.js';

const router = express.Router();

router.get('/', verifyToken, verifyRole(['admin', 'user']), getStallCategories);
router.post(
  '/create',
  verifyToken,
  verifyRole(['admin']),
  validateData(schemaStallCategories),
  createStallCategories
);
router.patch(
  '/update/:id',
  verifyToken,
  verifyRole(['admin']),
  validateData(schemaStallCategories),
  updateStallCategories
);
router.delete(
  '/delete/:id',
  verifyToken,
  verifyRole(['admin']),
  deleteCategories
);

export default router;
