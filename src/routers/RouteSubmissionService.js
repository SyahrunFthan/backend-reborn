import express from 'express';
import verifyToken from '../middlewares/VerivyToken.js';
import verifyRole from '../middlewares/VerifyRole.js';
import validateData from '../middlewares/Validation.js';
import { createSchema } from '../validations/SchemaSubmissionService.js';
import { createSubmissionService } from '../controllers/SubmissionService.js';

const router = express.Router();

router.post(
  '/create',
  verifyToken,
  verifyRole(['user']),
  validateData(createSchema),
  createSubmissionService
);

export default router;
