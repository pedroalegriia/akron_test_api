import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';
import { sellTicketValidator, redeemTicketValidator } from '../validators/TicketValidator';
import { ValidateRequest } from '../middlewares/ValidateRequest';

const router = Router();

router.post('/sell/:id', sellTicketValidator, ValidateRequest, TicketController.sell);
router.post('/:code/redeem', redeemTicketValidator, ValidateRequest, TicketController.redeem);

export default router;
