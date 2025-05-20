import express from "express";
import validateData from "../middlewares/Validation.js";
import {
  createVillageStall,
  updateVillageStall,
  deleteVillageStall
} from "../controllers/Stall.js";
import { schemaStall } from "../validations/SchemaStall.js";
import verifyToken from "../middlewares/VerivyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  verifyRole(["admin"]),
  validateData(schemaStall),
  createVillageStall
);
router.patch(
  "/update/:id",
  verifyToken,
  verifyRole(["admin"]),
  validateData(schemaStall),
  updateVillageStall
);
router.delete(
  "/delete/:id",
  verifyToken,
  verifyRole(["admin"]),
  deleteVillageStall
);

export default router;
