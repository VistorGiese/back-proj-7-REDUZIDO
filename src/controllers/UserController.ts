import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import UserModel from '../models/UserModel';
import EstablishmentProfileModel from '../models/EstablishmentProfileModel';
import ArtistProfileModel from '../models/ArtistProfileModel';
import { generateToken } from '../utils/jwt';
import { validateEmailFormat, validatePasswordFormat } from '../services/userValidationServices';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validações
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    const emailError = validateEmailFormat(email);
    if (emailError) {
      return res.status(400).json({ error: emailError });
    }

    const passwordError = validatePasswordFormat(password);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    // Verificar se email já existe
    const existingUser = await UserModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Gerar token
    const token = generateToken({ id: user.id, email: user.email });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = generateToken({ id: user.id, email: user.email });

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não identificado' });
    }

    // Buscar usuário com perfis
    const user = await UserModel.findByPk(userId, {
      include: [
        {
          model: EstablishmentProfileModel,
          as: 'EstablishmentProfiles',
          include: [
            {
              association: 'Address',
              attributes: ['rua', 'cidade', 'estado'],
            },
          ],
        },
        {
          model: ArtistProfileModel,
          as: 'ArtistProfiles',
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        establishment_profiles: (user as any).EstablishmentProfiles || [],
        artist_profiles: (user as any).ArtistProfiles || [],
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar perfil do usuário' });
  }
};

export const createEstablishmentProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const {
      business_name,
      business_type,
      description,
      musical_genres,
      opening_hours,
      closing_hours,
      address_id,
      contact_phone,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não identificado' });
    }

    // Validações básicas
    if (!business_name || !musical_genres || !opening_hours || !closing_hours || !address_id || !contact_phone) {
      return res.status(400).json({ error: 'Campos obrigatórios não preenchidos' });
    }

    const profile = await EstablishmentProfileModel.create({
      user_id: userId,
      business_name,
      business_type: business_type || 'bar',
      description,
      musical_genres,
      opening_hours,
      closing_hours,
      address_id,
      contact_phone,
    });

    res.status(201).json({
      message: 'Perfil de estabelecimento criado com sucesso',
      profile,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar perfil de estabelecimento' });
  }
};

export const createArtistProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const {
      stage_name,
      bio,
      instruments,
      genres,
      experience_years,
      portfolio_url,
      profile_photo,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não identificado' });
    }

    // Validações básicas
    if (!stage_name) {
      return res.status(400).json({ error: 'Nome artístico é obrigatório' });
    }

    const profile = await ArtistProfileModel.create({
      user_id: userId,
      stage_name,
      bio,
      instruments: JSON.stringify(instruments || []),
      genres: JSON.stringify(genres || []),
      experience_years: experience_years || 0,
      portfolio_url,
      profile_photo,
    });

    res.status(201).json({
      message: 'Perfil de artista criado com sucesso',
      profile,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar perfil de artista' });
  }
};