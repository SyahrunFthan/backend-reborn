import express from 'express';
import validateData from '../middlewares/Validation.js';
import {
  createNews,
  updateNews,
  deleteNews,
  getNews,
  getNewsById,
} from '../controllers/News.js';
import { schemaNews } from '../validations/SchemaNews.js';
import verifyToken from '../middlewares/VerivyToken.js';
import verifyRole from '../middlewares/VerifyRole.js';

const router = express.Router();

router.get('/', getNews);
router.get('/:id', getNewsById);
router.post(
  '/create',
  verifyToken,
  verifyRole(['admin', 'user']),
  validateData(schemaNews),
  createNews
);
router.patch(
  '/update/:id',
  verifyToken,
  verifyRole(['admin', 'user']),
  validateData(schemaNews),
  updateNews
);
router.delete(
  '/delete/:id',
  verifyToken,
  verifyRole(['superadmin', 'admin']),
  deleteNews
);

export default router;
