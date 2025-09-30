import { Request, Response } from "express";
import FavoriteModel from "../models/FavoriteModel";

// Nota: Para validação de existência dos itens favoritos,
// implementar comunicação entre serviços com User, Band e Event Services

export const adicionarFavorito = async (req: Request, res: Response) => {
  try {
    const usuario_id = (req as any).user?.id;
    const { favoritavel_tipo, favoritavel_id } = req.body;

    if (!usuario_id) {
      return res.status(401).json({ erro: "Usuário não identificado" });
    }

    if (!favoritavel_tipo || !favoritavel_id) {
      return res.status(400).json({ erro: "Tipo e ID do favorito são obrigatórios" });
    }

    const tiposValidos = ['perfil_estabelecimento', 'perfil_artista', 'banda'];
    if (!tiposValidos.includes(favoritavel_tipo)) {
      return res.status(400).json({ erro: "Tipo de favorito inválido" });
    }

    // Nota: Validação de existência do item deve ser feita via comunicação entre serviços

    const favoritoExistente = await FavoriteModel.findOne({
      where: { usuario_id, favoritavel_tipo, favoritavel_id }
    });

    if (favoritoExistente) {
      return res.status(400).json({ erro: "Item já está nos seus favoritos" });
    }

    const favorito = await FavoriteModel.create({
      usuario_id,
      favoritavel_tipo,
      favoritavel_id
    });

    res.status(201).json({ 
      mensagem: "Item adicionado aos favoritos com sucesso",
      favorito: {
        id: favorito.id,
        tipo: favorito.favoritavel_tipo,
        item_id: favorito.favoritavel_id,
        data_criacao: favorito.data_criacao
      }
    });
  } catch (error) {
    console.error('Erro ao adicionar favorito:', error);
    res.status(500).json({ erro: "Erro ao adicionar item aos favoritos" });
  }
};

export const removerFavorito = async (req: Request, res: Response) => {
  try {
    const usuario_id = (req as any).user?.id;
    const { favoritavel_tipo, favoritavel_id } = req.params;

    if (!usuario_id) {
      return res.status(401).json({ erro: "Usuário não identificado" });
    }

    const favorito = await FavoriteModel.findOne({
      where: { usuario_id, favoritavel_tipo, favoritavel_id }
    });

    if (!favorito) {
      return res.status(404).json({ erro: "Item não está nos seus favoritos" });
    }

    await favorito.destroy();

    res.json({ mensagem: "Item removido dos favoritos com sucesso" });
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    res.status(500).json({ erro: "Erro ao remover item dos favoritos" });
  }
};

export const obterFavoritos = async (req: Request, res: Response) => {
  try {
    const usuario_id = (req as any).user?.id;
    const { tipo } = req.query; // Filtrar por tipo opcional

    if (!usuario_id) {
      return res.status(401).json({ erro: "Usuário não identificado" });
    }

    const whereClause: any = { usuario_id };
    if (tipo && ['perfil_estabelecimento', 'perfil_artista', 'banda'].includes(tipo as string)) {
      whereClause.favoritavel_tipo = tipo;
    }

    const favoritos = await FavoriteModel.findAll({
      where: whereClause,
      order: [['data_criacao', 'DESC']]
    });

    const favoritosFormatados = favoritos.map(favorito => ({
      id: favorito.id,
      tipo: favorito.favoritavel_tipo,
      item_id: favorito.favoritavel_id,
      data_criacao: favorito.data_criacao,
      // Nota: Detalhes do item devem ser buscados do serviço correspondente
    }));

    res.json({
      mensagem: "Lista de favoritos recuperada com sucesso",
      total: favoritosFormatados.length,
      favoritos: favoritosFormatados
    });
  } catch (error) {
    console.error('Erro ao obter favoritos:', error);
    res.status(500).json({ erro: "Erro ao buscar favoritos" });
  }
};

export const verificarFavorito = async (req: Request, res: Response) => {
  try {
    const usuario_id = (req as any).user?.id;
    const { favoritavel_tipo, favoritavel_id } = req.params;

    if (!usuario_id) {
      return res.status(401).json({ erro: "Usuário não identificado" });
    }

    const favorito = await FavoriteModel.findOne({
      where: { usuario_id, favoritavel_tipo, favoritavel_id }
    });

    res.json({
      eh_favorito: !!favorito,
      tipo: favoritavel_tipo,
      item_id: Number(favoritavel_id)
    });
  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
    res.status(500).json({ erro: "Erro ao verificar favorito" });
  }
};