import { Request, Response } from 'express';
import BandModel from '../models/BandModel';
import BandMemberModel from '../models/BandMemberModel';

// Note: For functions requiring ArtistProfile and User data,
// implement inter-service communication with User Service

export const createBand = async (req: Request, res: Response) => {
  try {
    const { nome_banda, descricao, generos_musicais, perfil_artista_id } = req.body;

    if (!nome_banda || !perfil_artista_id) {
      return res.status(400).json({ error: 'Nome da banda e perfil de artista são obrigatórios' });
    }

    // Note: Artist profile validation should be done via User Service
    // For now, create band with provided artist profile ID

    // Criar a banda
    const band = await BandModel.create({
      nome_banda,
      descricao,
      generos_musicais: JSON.stringify(generos_musicais || []),
      esta_ativo: true,
    });

    await BandMemberModel.create({
      banda_id: band.id,
      perfil_artista_id,
      funcao: 'Líder',
      e_lider: true,
      status: 'approved',
      data_entrada: new Date(),
    });

    res.status(201).json({
      message: 'Banda criada com sucesso',
      band: {
        id: band.id,
        nome_banda: band.nome_banda,
        descricao: band.descricao,
        generos_musicais: JSON.parse(band.generos_musicais || '[]'),
        esta_ativo: band.esta_ativo,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar banda' });
  }
};

export const getBandDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const band = await BandModel.findByPk(id, {
      include: [
        {
          model: BandMemberModel,
          as: 'Members',
          where: { status: 'approved' },
          required: false,
        },
      ],
    });

    if (!band) {
      return res.status(404).json({ error: 'Banda não encontrada' });
    }

    res.json({
      id: band.id,
      nome_banda: band.nome_banda,
      descricao: band.descricao,
      generos_musicais: JSON.parse(band.generos_musicais || '[]'),
      esta_ativo: band.esta_ativo,
      members: (band as any).Members?.map((member: any) => ({
        id: member.id,
        perfil_artista_id: member.perfil_artista_id,
        funcao: member.funcao,
        e_lider: member.e_lider,
        data_entrada: member.data_entrada,
        status: member.status,
      })) || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar detalhes da banda' });
  }
};

export const addMemberToBand = async (req: Request, res: Response) => {
  try {
    const { banda_id, perfil_artista_id, funcao } = req.body;

    if (!banda_id || !perfil_artista_id) {
      return res.status(400).json({ error: 'ID da banda e perfil de artista são obrigatórios' });
    }

    const currentMembers = await BandMemberModel.count({
      where: {
        banda_id,
        status: 'approved',
      },
    });

    if (currentMembers >= 10) {
      return res.status(400).json({ error: 'Banda já atingiu o limite máximo de 10 membros' });
    }

    const existingMembership = await BandMemberModel.findOne({
      where: {
        banda_id,
        perfil_artista_id,
      },
    });

    if (existingMembership) {
      return res.status(400).json({ error: 'Artista já está na banda' });
    }

    const member = await BandMemberModel.create({
      banda_id,
      perfil_artista_id,
      funcao: funcao || 'Membro',
      e_lider: false,
      status: 'approved',
      data_entrada: new Date(),
    });

    res.status(201).json({
      message: 'Membro adicionado com sucesso',
      member: {
        id: member.id,
        banda_id: member.banda_id,
        perfil_artista_id: member.perfil_artista_id,
        funcao: member.funcao,
        status: member.status,
        data_entrada: member.data_entrada,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao adicionar membro' });
  }
};

export const removeMemberFromBand = async (req: Request, res: Response) => {
  try {
    const { banda_id, perfil_artista_id } = req.body;

    if (!banda_id || !perfil_artista_id) {
      return res.status(400).json({ error: 'ID da banda e perfil de artista são obrigatórios' });
    }

    const member = await BandMemberModel.findOne({
      where: {
        banda_id,
        perfil_artista_id,
      },
    });

    if (!member) {
      return res.status(404).json({ error: 'Membro não encontrado na banda' });
    }

    if (member.e_lider) {
      return res.status(400).json({ error: 'Não é possível remover o líder da banda' });
    }

    await member.destroy();

    res.json({ message: 'Membro removido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao remover membro' });
  }
};