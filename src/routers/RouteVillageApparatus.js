import express from "express";
import validateData from "../middlewares/Validation.js";
import {
  createVillageApparatus
} from "../controllers/VillageApparatus.js";
// import { schemaStallCategories } from "../validations/SchemaStallCategories.js";
import verifyToken from "../middlewares/VerivyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  verifyRole(["superadmin", "admin"]),
//   validateData(schemaStallCategories),
  createVillageApparatus
);
// router.patch(
//   "/update/:id",
//   verifyToken,
//   verifyRole(["superadmin", "admin"]),
//   validateData(schemaStallCategories),
//   updateStallCategories
// );
// router.delete(
//   "/delete/:id",
//   verifyToken,
//   verifyRole(["superadmin", "admin"]),
//   deleteCategories
// );

export default router;
