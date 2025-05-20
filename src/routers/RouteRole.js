import express from "express";
import { 
    createRole, 
    updateRole, 
    deleteRole 
} from "../controllers/Role.js";
import validateData from "../middlewares/Validation.js";
import { schemaRole } from "../validations/SchemaRole.js";

const router = express.Router();

router.post(
    "/create",
    validateData(schemaRole), 
    createRole
);
router.patch(
    "/update/:id",
    updateRole
);
router.delete(
    "/delete/:id",
    validateData(schemaRole),
    deleteRole

)

export default router;
