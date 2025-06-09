import express from 'express';
import {
  createRegion,
  deleteRegion,
  getRegion,
  getRegionAndVillage,
  updateRegion,
} from '../controllers/Region.js';
import validateData from '../middlewares/Validation.js';
import verifyToken from '../middlewares/VerivyToken.js';
import verifyRole from '../middlewares/VerifyRole.js';
import { schemaRegion } from '../validations/SchemaRegion.js';

const router = express.Router();

router.get('/', verifyToken, verifyRole(['admin', 'user']), getRegion);
router.get(
  '/village',
  verifyToken,
  verifyRole(['admin', 'user']),
  getRegionAndVillage
);
router.post(
  '/create',
  verifyToken,
  verifyRole(['admin']),
  validateData(schemaRegion),
  createRegion
);
router.patch(
  '/update/:id',
  verifyToken,
  verifyRole(['admin']),
  validateData(schemaRegion),
  updateRegion
);
router.delete('/delete/:id', verifyToken, verifyRole(['admin']), deleteRegion);

export default router;
