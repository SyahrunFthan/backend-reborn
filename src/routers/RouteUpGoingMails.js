import express from 'express';
import {
  getUpGoingMailId,
  createUpGoingMail,
  deleteUpGoingMail,
  getUpGoingMails,
  updateUpGoingMail,
} from '../controllers/UpGoingMail.js';
import verifyRole from '../middlewares/VerifyRole.js';
import verifyToken from '../middlewares/VerivyToken.js';
import validateData from '../middlewares/Validation.js';
import schemaUpGoingMail from '../validations/SchemaUpGoingMail.js';

const router = express.Router();

router.get('/', verifyToken, verifyRole(['admin']), getUpGoingMails);
router.get('/', verifyToken, verifyRole(['admin']), getUpGoingMailId);
router.post(
  '/',
  verifyToken,
  verifyRole(['admin']),
  validateData(schemaUpGoingMail),
  createUpGoingMail
);
router.patch(
  '/',
  verifyToken,
  verifyRole(['admin']),
  validateData(schemaUpGoingMail),
  updateUpGoingMail
);
router.delete('/:id', verifyToken, verifyRole(['admin']), deleteUpGoingMail);

export default router;
