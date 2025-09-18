import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import EstablishmentModel from '../models/EstablishmentModel';

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_super_secreto';

export const loginEstablishment = async (req: Request, res: Response) => {
  try {
    const { email_responsavel, senha } = req.body;
    if (!email_responsavel || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }
    const establishment = await EstablishmentModel.findOne({ where: { email_responsavel } });
    if (!establishment) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const senhaValida = await bcrypt.compare(senha, establishment.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }
    const token = jwt.sign({ id: establishment.id, email: establishment.email_responsavel }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar login', details: error });
  }
};
