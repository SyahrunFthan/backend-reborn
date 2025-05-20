import express from "express";
import {
  createIncomingMail,
  deleteIncomingMail,
  getIncomingMailId,
  getIncomingMails,
  updateIncomingMail,
} from "../controllers/IncomingMailsControllers.js";
import verifyToken from "../middlewares/VerivyToken.js";
import verifyRole from "../middlewares/VerifyRole.js";

const router = express.Router();

/**
 * @swagger
 * /api/incoming-mails:
 *   get:
 *     summary: Mengambil semua surat masuk
 *     tags: [Surat Masuk]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data surat masuk
 */
router.get("/", verifyToken, verifyRole(["admin", "user"]), getIncomingMails);

router.get(
  "/:id",
  verifyToken,
  verifyRole(["admin", "user"]),
  getIncomingMailId
);
router.post("/", verifyToken, verifyRole(["admin"]), createIncomingMail);
router.patch("/:id", verifyToken, verifyRole(["admin"]), updateIncomingMail);
router.delete("/:id", verifyToken, verifyRole(["admin"]), deleteIncomingMail);

export default router;
