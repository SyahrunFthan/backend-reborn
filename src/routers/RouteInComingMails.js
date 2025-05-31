import express from 'express';
import {
  createIncomingMail,
  deleteIncomingMail,
  getIncomingMailId,
  getIncomingMails,
  updateIncomingMail,
} from '../controllers/InComingMail.js';
import verifyToken from '../middlewares/VerivyToken.js';
import verifyRole from '../middlewares/VerifyRole.js';
import validateData from '../middlewares/Validation.js';
import schemaInComingMail from '../validations/SchemaInComingMail.js';

const router = express.Router();

router.get('/', verifyToken, verifyRole(['admin', 'user']), getIncomingMails);
router.get(
  '/:id',
  verifyToken,
  verifyRole(['admin', 'user']),
  getIncomingMailId
);
router.post(
  '/',
  verifyToken,
  verifyRole(['admin']),
  validateData(schemaInComingMail),
  createIncomingMail
);
router.patch(
  '/:id',
  verifyToken,
  verifyRole(['admin']),
  validateData(schemaInComingMail),
  updateIncomingMail
);
router.delete('/:id', verifyToken, verifyRole(['admin']), deleteIncomingMail);

export default router;
