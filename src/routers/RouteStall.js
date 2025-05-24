import express from 'express';
import validateData from '../middlewares/Validation.js';
import {
  createVillageStall,
  updateVillageStall,
  deleteVillageStall,
  getStallBySearch,
} from '../controllers/Stall.js';
import { schemaStall } from '../validations/SchemaStall.js';
import verifyToken from '../middlewares/VerivyToken.js';
import verifyRole from '../middlewares/VerifyRole.js';

const router = express.Router();

router.get('/', getStallBySearch);
router.post(
  '/create',
  verifyToken,
  verifyRole(['admin', 'user']),
  validateData(schemaStall),
  createVillageStall
);
router.patch(
  '/update/:id',
  verifyToken,
  verifyRole(['admin', 'user']),
  validateData(schemaStall),
  updateVillageStall
);
router.delete(
  '/delete/:id',
  verifyToken,
  verifyRole(['admin', 'user']),
  deleteVillageStall
);

export default router;
