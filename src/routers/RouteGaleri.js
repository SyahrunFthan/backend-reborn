import express from 'express';
import validateData from '../middlewares/Validation.js';
import {
  createGaleri,
  updateGaleri,
  deleteGaleri,
} from '../controllers/Galeri.js';
import { schemaGaleri } from '../validations/SchemaGaleri.js';
import verifyToken from '../middlewares/VerivyToken.js';
import verifyRole from '../middlewares/VerifyRole.js';

const router = express.Router();

router.post(
  '/create',
  verifyToken,
  verifyRole(['admin']),
  validateData(schemaGaleri),
  createGaleri
);
router.patch(
  '/update/:id',
  verifyToken,
  verifyRole(['admin']),
  validateData(schemaGaleri),
  updateGaleri
);
router.delete('/delete/:id', verifyToken, verifyRole(['admin']), deleteGaleri);

export default router;
