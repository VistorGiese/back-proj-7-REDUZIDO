import { Router } from 'express';
import {
  createBand,
  getBandDetails,
  inviteMemberToBand,
  respondToBandInvitation,
  getUserBands,
} from '../controllers/BandManagementController';
import { authMiddleware } from '../middleware/authmiddleware';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Gerenciamento de bandas
router.post('/', createBand);
router.get('/my-bands', getUserBands);
router.get('/:id', getBandDetails);

// Gerenciamento de membros
router.post('/invite', inviteMemberToBand);
router.post('/invitation/respond', respondToBandInvitation);

export default router;