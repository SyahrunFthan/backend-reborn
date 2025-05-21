import express from "express";
import validateData from "../middlewares/Validation.js";
import { createNews, updateNews,deleteNews } from "../controllers/News.js";
import { schemaNews } from "../validations/SchemaNews.js";
import verifyToken from "../middlewares/VerivyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";

const router = express.Router();

router.post(
  "/create/:id",
  //   verifyToken,
  //   verifyRole(["user"]),
  validateData(schemaNews),
  createNews
);
router.patch(
  "/update/:id",
//   verifyToken,
//   verifyRole(["superadmin", "admin"]),
  validateData(schemaNews),
  updateNews
);
router.delete(
  "/delete/:id",
//   verifyToken,
//   verifyRole(["superadmin", "admin"]),
  deleteNews
);

export default router;
