import express from 'express';
import {
  createResidents,
  updateResidents,
  deleteResidents,
  getResidents,
  getResidentsById,
  getRegionForm,
} from '../controllers/Residents.js';
import validateData from '../middlewares/Validation.js';
import { schemaResidents } from '../validations/SchemaResidents.js';
import verifyToken from '../middlewares/VerivyToken.js';
import verifyRole from '../middlewares/VerifyRole.js';

const router = express.Router();

router.get('/', verifyToken, verifyRole(['admin']), getResidents);
router.get('/region', verifyToken, verifyRole(['admin']), getRegionForm);
router.get('/:id', getResidentsById);
router.post(
  '/create',
  verifyToken,
  verifyRole(['admin']),
  validateData(schemaResidents),
  createResidents
);
router.patch(
  '/update/:id',
  verifyToken,
  verifyRole(['admin']),
  validateData(schemaResidents),
  updateResidents
);
router.delete(
  '/delete/:id',
  verifyToken,
  verifyRole(['admin']),
  deleteResidents
);

export default router;
