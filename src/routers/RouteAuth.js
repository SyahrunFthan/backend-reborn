import express from 'express';
import validateData from '../middlewares/Validation.js';
import {
  checkNikForRegister,
  login,
  logout,
  register,
  removeToken,
} from '../controllers/Auth.js';
import {
  checkNikSchema,
  loginSchema,
  registerSchema,
} from '../validations/SchemaAuth.js';
import verifyToken from '../middlewares/VerivyToken.js';

const router = express.Router();

router.post('/login', validateData(loginSchema), login);
router.post('/register', validateData(registerSchema), register);
router.post('/check-nik', validateData(checkNikSchema), checkNikForRegister);
router.delete('/logout', verifyToken, logout);
router.delete('/remove-token/:id', removeToken, logout);

export default router;
