import express from 'express';
import validateData from '../middlewares/Validation.js';
import {
  createService,
  getService,
  updateService,
  deleteService,
  getServiceById,
  getServiceByType,
} from '../controllers/Service.js';
import { schemaService } from '../validations/SchemaService.js';
import verifyToken from '../middlewares/VerivyToken.js';
import verifyRole from '../middlewares/VerifyRole.js';

const router = express.Router();

router.get('/', getService);
router.get(
  '/type',
  verifyToken,
  verifyRole(['admin', 'user']),
  getServiceByType
);
router.get('/:id', getServiceById);
router.post(
  '/create',
  verifyToken,
  verifyRole(['admin', 'user']),
  validateData(schemaService),
  createService
);
router.patch(
  '/update/:id',
  verifyToken,
  verifyRole(['admin', 'user']),
  validateData(schemaService),
  updateService
);
router.delete(
  '/delete/:id',
  verifyToken,
  verifyRole(['admin', 'user']),
  deleteService
);

export default router;
