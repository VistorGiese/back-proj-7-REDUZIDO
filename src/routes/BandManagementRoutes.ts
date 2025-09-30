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


router.use(authMiddleware);


router.post('/', createBand);
router.get('/minhas-bandas', getUserBands);
router.get('/:id', getBandDetails);
router.post('/convidar', inviteMemberToBand);
router.post('/convite/responder', respondToBandInvitation);

export default router;