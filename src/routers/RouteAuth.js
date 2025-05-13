import express from "express";
import validateData from "../middlewares/Validation.js";
import { login, logout, register } from "../controllers/AuthControllers.js";
import { loginSchema, registerSchema } from "../validations/SchemaAuth.js";
import verifyToken from "../middlewares/VerivyToken.js";

const router = express.Router();

router.post("/login", validateData(loginSchema), login);
router.post("/register", validateData(registerSchema), register);
router.delete("/logout", verifyToken, logout);

export default router;
