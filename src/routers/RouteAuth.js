import express from 'express';
import validateData from '../middlewares/Validation.js';
import {
  checkNikForRegister,
  login,
  loginWeb,
  logout,
  register,
  registerWeb,
  removeToken,
  sendOtpToEmail,
} from '../controllers/Auth.js';
import {
  checkNikSchema,
  loginSchema,
  loginWebSchema,
  registerSchema,
  registerWebSchema,
} from '../validations/SchemaAuth.js';
import verifyToken from '../middlewares/VerivyToken.js';

const router = express.Router();

router.post('/send-otp', validateData(registerSchema), sendOtpToEmail);
router.post('/login', validateData(loginSchema), login);
router.post('/login-web', validateData(loginWebSchema), loginWeb);
router.post('/register', validateData(registerSchema), register);
router.post('/register-web', validateData(registerWebSchema), registerWeb);
router.post('/check-nik', validateData(checkNikSchema), checkNikForRegister);
router.delete('/logout', verifyToken, logout);
router.delete('/remove-token/:id', removeToken, logout);

export default router;
