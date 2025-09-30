import { Router } from 'express';
import {
  createBand,
  getBandDetails,
  addMemberToBand,
  removeMemberFromBand,
} from '../controllers/BandManagementController';

const router = Router();

router.post('/', createBand);
router.get('/:id', getBandDetails);
router.post('/member/add', addMemberToBand);
router.delete('/member/remove', removeMemberFromBand);

export default router;