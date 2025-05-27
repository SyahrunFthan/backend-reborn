import express from 'express';
import { createRegion } from '../controllers/Region.js';
import validateData from '../middlewares/Validation.js';
import verifyToken from '../middlewares/VerivyToken.js';
import verifyRole from '../middlewares/VerifyRole.js';
import { schemaRegion } from '../validations/SchemaRegion.js';

const router = express.Router();

router.post(
  '/create',
  // verifyToken,
  // verifyRole(['admin', 'user']),
  validateData(schemaRegion),
  createRegion
);

export default router;
