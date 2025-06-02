import express from 'express';
import validateData from '../middlewares/Validation.js';
import {
  checkNikForRegister,
  login,
  loginWeb,
  logout,
  register,
  removeToken,
  sendOtpToEmail,
} from '../controllers/Auth.js';
import {
  checkNikSchema,
  loginSchema,
  loginWebSchema,
  registerSchema,
} from '../validations/SchemaAuth.js';
import verifyToken from '../middlewares/VerivyToken.js';

const router = express.Router();

/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     summary: Kirim OTP ke email
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP berhasil dikirim ke email
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Terjadi kesalahan server
 */
router.post('/send-otp', validateData(registerSchema), sendOtpToEmail);

/**
 * @swagger
 * /auth/login:
 *    post:
 *      summary: Login Mobile
 *      tags:
 *        - Auth
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  type: string
 *                  example: user@gmail.com
 *                password:
 *                  type: string
 *                  example: 12345
 *      responses:
 *          200:
 *            description: Berhasil Login
 *          400:
 *            description: Bad Request
 *          500:
 *            description: Terjadi kesalahan server
 */
router.post('/login', validateData(loginSchema), login);

/**
 * @swagger
 * /auth/login-admin:
 *    post:
 *      summary: Login Website
 *      tags:
 *        - Auth
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                  example: 72631883781231
 *                password:
 *                  type: string
 *                  example: 12345
 *      responses:
 *          200:
 *            description: Berhasil Login
 *          400:
 *            description: Bad Request
 *          500:
 *            description: Terjadi kesalahan server
 */
router.post('/login-web', validateData(loginWebSchema), loginWeb);

/**
 * @swagger
 * /auth/register:
 *    post:
 *      summary: Register Mobile & Web
 *      tags:
 *        - Auth
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                fullname:
 *                  type: string
 *                  example: john doe
 *                phone:
 *                  type: string
 *                  example: 081234567890
 *                username:
 *                  type: string
 *                  example: john_doe
 *                email:
 *                  type: string
 *                  example: user@gmail.com
 *                password:
 *                  type: string
 *                  example: 12345
 *                confirmPassword:
 *                  type: string
 *                  example: 12345
 *                resident_id:
 *                  type: string
 *                  example: Resident ID
 *                role_id:
 *                  type: integer
 *                  example: 2
 *      responses:
 *          201:
 *            description: Berhasil Membuat Akun
 *          400:
 *            description: Bad Request
 *          500:
 *            description: Terjadi kesalahan server
 */
router.post('/register', validateData(registerSchema), register);

/**
 * @swagger
 * /auth/check-nik:
 *   post:
 *     summary: Check NIK
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nik:
 *                 type: string
 *                 example: Input 16 Angka
 *     responses:
 *       200:
 *         description: response object data
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found Nik In Table Resident
 *       409:
 *         description: User is register
 *       500:
 *         description: Internal server error
 */
router.post('/check-nik', validateData(checkNikSchema), checkNikForRegister);
router.delete('/logout', verifyToken, logout);
router.delete('/remove-token/:id', removeToken, logout);

export default router;
