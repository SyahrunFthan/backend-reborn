import express from 'express';
import { createRole, updateRole, deleteRole } from '../controllers/Role.js';
import validateData from '../middlewares/Validation.js';
import { schemaRole } from '../validations/SchemaRole.js';
import verifyToken from '../middlewares/VerivyToken.js';
import verifyRole from '../middlewares/VerifyRole.js';

const router = express.Router();

router.post(
  '/create',
  verifyToken,
  verifyRole(['superadmin']),
  validateData(schemaRole),
  createRole
);
router.patch(
  '/update/:id',
  verifyToken,
  verifyRole(['superadmin']),
  validateData(schemaRole),
  updateRole
);
router.delete(
  '/delete/:id',
  verifyToken,
  verifyRole(['superadmin']),
  validateData(schemaRole),
  deleteRole
);

export default router;
