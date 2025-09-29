import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  createEstablishmentProfile,
  createArtistProfile,
} from '../controllers/UserController';
import { authMiddleware } from '../middleware/authmiddleware';

const router = Router();

// Rotas de autenticação
router.post('/register', registerUser);
router.post('/login', loginUser);

// Rotas protegidas
router.get('/profile', authMiddleware, getUserProfile);
router.post('/establishment-profile', authMiddleware, createEstablishmentProfile);
router.post('/artist-profile', authMiddleware, createArtistProfile);

export default router;