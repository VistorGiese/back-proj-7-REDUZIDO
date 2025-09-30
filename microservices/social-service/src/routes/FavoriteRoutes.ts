import { Router } from "express";
import {
  adicionarFavorito,
  removerFavorito,
  obterFavoritos,
  verificarFavorito,
} from "../controllers/FavoriteController";

const router = Router();

// Remover middleware de autenticação por enquanto - será tratado pelo Gateway
router.post("/", adicionarFavorito);             
router.delete("/:favoritavel_tipo/:favoritavel_id", removerFavorito);
router.get("/", obterFavoritos);
router.get("/:favoritavel_tipo/:favoritavel_id", verificarFavorito);

export default router;