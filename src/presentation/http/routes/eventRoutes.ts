import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import {
  createEventValidator,
  updateEventValidator,
  sellEventValidator,
  detailEventValidator,
  deleteEventValidator
} from '../validators/EventValidator';
import { ValidateRequest } from '../middlewares/ValidateRequest';

const router = Router();

router.post('/', createEventValidator, ValidateRequest, EventController.create);
router.put('/:id', updateEventValidator, ValidateRequest, EventController.update);
router.delete('/:id', deleteEventValidator, ValidateRequest, EventController.delete);
router.post('/:id/sell', sellEventValidator, ValidateRequest, EventController.sell);
router.get('/:id', detailEventValidator, ValidateRequest, EventController.detail);

export default router;
