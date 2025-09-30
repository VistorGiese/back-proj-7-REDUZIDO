import { Request, Response } from "express";
import FavoriteModel from "../models/FavoriteModel";
import EstablishmentModel from "../models/EstablishmentModel";
import BandModel from "../models/BandModel";
import { AuthRequest } from "../middleware/authmiddleware";

export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { banda_id } = req.body;
    const estabelecimento_id = req.user?.id;

    if (!banda_id) {
      return res.status(400).json({ error: "ID da banda é obrigatório" });
    }

    if (!estabelecimento_id) {
      return res.status(401).json({ error: "Estabelecimento não identificado" });
    }

    const banda = await BandModel.findByPk(banda_id);
    if (!banda) {
      return res.status(404).json({ error: "Banda não encontrada" });
    }

    const favoriteExistente = await FavoriteModel.findOne({
      where: { estabelecimento_id, banda_id }
    });

    if (favoriteExistente) {
      return res.status(400).json({ error: "Banda já está nos seus favoritos" });
    }

    // Criar
    const favorite = await FavoriteModel.create({
      estabelecimento_id,
      banda_id
    });

    res.status(201).json({ 
      message: "Banda adicionada aos favoritos",
      favorite 
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar banda aos favoritos" });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { banda_id } = req.params;
    const estabelecimento_id = req.user?.id;

    if (!estabelecimento_id) {
      return res.status(401).json({ error: "Estabelecimento não identificado" });
    }

    const favorite = await FavoriteModel.findOne({
      where: { estabelecimento_id, banda_id }
    });

    if (!favorite) {
      return res.status(404).json({ error: "Banda não está nos seus favoritos" });
    }

    await favorite.destroy();

    res.json({ message: "Banda removida dos favoritos" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover banda dos favoritos" });
  }
};

export const getFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const estabelecimento_id = req.user?.id;

    if (!estabelecimento_id) {
      return res.status(401).json({ error: "Estabelecimento não identificado" });
    }

    const favorites = await FavoriteModel.findAll({
      where: { estabelecimento_id },
      include: [
        {
          model: BandModel,
          as: 'Band',
          attributes: ['id', 'nome_banda', 'descricao', 'imagem']
        }
      ],
      order: [['data_favoritado', 'DESC']]
    });

    res.json({
      message: "Lista de bandas favoritas",
      total: favorites.length,
      favorites
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar bandas favoritas" });
  }
};

export const checkFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { banda_id } = req.params;
    const estabelecimento_id = req.user?.id;

    if (!estabelecimento_id) {
      return res.status(401).json({ error: "Estabelecimento não identificado" });
    }

    const favorite = await FavoriteModel.findOne({
      where: { estabelecimento_id, banda_id }
    });

    res.json({
      isFavorite: !!favorite,
      banda_id: Number(banda_id)
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao verificar favorito" });
  }
};