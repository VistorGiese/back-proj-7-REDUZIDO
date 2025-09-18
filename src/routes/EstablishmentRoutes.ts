import { Router } from "express";
import {
  createEstablishment,
  getEstablishments,
  getEstablishmentById,
  updateEstablishment,
  deleteEstablishment,
} from "../controllers/EstablishmentController";

const router = Router();

router.post("/", createEstablishment);
router.get("/", getEstablishments);
router.get("/:id", getEstablishmentById);
router.put("/:id", updateEstablishment);
router.delete("/:id", deleteEstablishment);

export default router;
