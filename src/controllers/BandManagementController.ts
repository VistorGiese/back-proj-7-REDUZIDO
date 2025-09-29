import { Request, Response } from 'express';
import BandModel from '../models/BandModel';
import BandMemberModel from '../models/BandMemberModel';
import ArtistProfileModel from '../models/ArtistProfileModel';
import UserModel from '../models/UserModel';

export const createBand = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { name, description, genres, artist_profile_id } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não identificado' });
    }

    if (!name || !artist_profile_id) {
      return res.status(400).json({ error: 'Nome da banda e perfil de artista são obrigatórios' });
    }

    // Verificar se o perfil de artista pertence ao usuário
    const artistProfile = await ArtistProfileModel.findOne({
      where: {
        id: artist_profile_id,
        user_id: userId,
      },
    });

    if (!artistProfile) {
      return res.status(404).json({ error: 'Perfil de artista não encontrado ou não pertence ao usuário' });
    }

    // Criar a banda
    const band = await BandModel.create({
      name,
      description,
      genres: JSON.stringify(genres || []),
      is_active: true,
    });

    // Adicionar o criador como líder da banda
    await BandMemberModel.create({
      band_id: band.id,
      artist_profile_id,
      role: 'Líder',
      is_leader: true,
      status: 'approved',
      joined_at: new Date(),
    });

    res.status(201).json({
      message: 'Banda criada com sucesso',
      band: {
        id: band.id,
        name: band.name,
        description: band.description,
        genres: JSON.parse(band.genres || '[]'),
        is_active: band.is_active,
      },
    });
  } catch (error) {
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
          include: [
            {
              model: ArtistProfileModel,
              as: 'ArtistProfile',
              include: [
                {
                  model: UserModel,
                  as: 'User',
                  attributes: ['name'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!band) {
      return res.status(404).json({ error: 'Banda não encontrada' });
    }

    res.json({
      id: band.id,
      name: band.name,
      description: band.description,
      genres: JSON.parse(band.genres || '[]'),
      is_active: band.is_active,
      members: (band as any).Members?.map((member: any) => ({
        id: member.id,
        role: member.role,
        is_leader: member.is_leader,
        joined_at: member.joined_at,
        artist: {
          id: member.ArtistProfile.id,
          stage_name: member.ArtistProfile.stage_name,
          user_name: member.ArtistProfile.User.name,
        },
      })) || [],
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar detalhes da banda' });
  }
};

export const inviteMemberToBand = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { band_id, artist_profile_id, role } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não identificado' });
    }

    // Verificar se o usuário é líder da banda
    const userLeadership = await BandMemberModel.findOne({
      where: {
        band_id,
        is_leader: true,
        status: 'approved',
      },
      include: [
        {
          model: ArtistProfileModel,
          as: 'ArtistProfile',
          where: { user_id: userId },
        },
      ],
    });

    if (!userLeadership) {
      return res.status(403).json({ error: 'Apenas líderes da banda podem convidar membros' });
    }

    // Verificar se a banda não está cheia (máximo 10 membros)
    const currentMembers = await BandMemberModel.count({
      where: {
        band_id,
        status: 'approved',
      },
    });

    if (currentMembers >= 10) {
      return res.status(400).json({ error: 'Banda já atingiu o limite máximo de 10 membros' });
    }

    // Verificar se o artista já está na banda ou foi convidado
    const existingMembership = await BandMemberModel.findOne({
      where: {
        band_id,
        artist_profile_id,
      },
    });

    if (existingMembership) {
      return res.status(400).json({ error: 'Artista já está na banda ou foi convidado' });
    }

    // Criar o convite
    const invitation = await BandMemberModel.create({
      band_id,
      artist_profile_id,
      role: role || 'Membro',
      is_leader: false,
      status: 'pending',
    });

    res.status(201).json({
      message: 'Convite enviado com sucesso',
      invitation: {
        id: invitation.id,
        band_id: invitation.band_id,
        artist_profile_id: invitation.artist_profile_id,
        role: invitation.role,
        status: invitation.status,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao enviar convite' });
  }
};

export const respondToBandInvitation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { invitation_id, action } = req.body; // action: 'accept' | 'reject'

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não identificado' });
    }

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Ação inválida. Use "accept" ou "reject"' });
    }

    // Buscar o convite
    const invitation = await BandMemberModel.findOne({
      where: {
        id: invitation_id,
        status: 'pending',
      },
      include: [
        {
          model: ArtistProfileModel,
          as: 'ArtistProfile',
          where: { user_id: userId },
        },
      ],
    });

    if (!invitation) {
      return res.status(404).json({ error: 'Convite não encontrado ou não pertence ao usuário' });
    }

    // Atualizar o status
    if (action === 'accept') {
      invitation.status = 'approved';
      invitation.joined_at = new Date();
    } else {
      invitation.status = 'rejected';
    }

    await invitation.save();

    res.json({
      message: action === 'accept' ? 'Convite aceito com sucesso' : 'Convite rejeitado',
      invitation: {
        id: invitation.id,
        status: invitation.status,
        joined_at: invitation.joined_at,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao responder convite' });
  }
};

export const getUserBands = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não identificado' });
    }

    // Buscar bandas do usuário através dos perfis de artista
    const userArtistProfiles = await ArtistProfileModel.findAll({
      where: { user_id: userId },
      include: [
        {
          model: BandMemberModel,
          as: 'BandMemberships',
          where: { status: 'approved' },
          required: false,
          include: [
            {
              model: BandModel,
              as: 'Band',
            },
          ],
        },
      ],
    });

    const bands = userArtistProfiles.flatMap((profile: any) =>
      profile.BandMemberships?.map((membership: any) => ({
        id: membership.Band.id,
        name: membership.Band.name,
        description: membership.Band.description,
        genres: JSON.parse(membership.Band.genres || '[]'),
        role: membership.role,
        is_leader: membership.is_leader,
        joined_at: membership.joined_at,
      })) || []
    );

    res.json({ bands });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar bandas do usuário' });
  }
};