import { Request, Response, NextFunction } from 'express';
import { CreateEventUseCase } from '../../../application/usecases/CreateEventUseCase';
import { SellTicketUseCase } from '../../../application/usecases/SellTicketUseCase';
import { GetEventDetailUseCase } from '../../../application/usecases/GetEventDetailUseCase';
import { UpdateEventUseCase } from '../../../application/usecases/UpdateEventUseCase';
import { DeleteEventUseCase } from '../../../application/usecases/DeleteEventUseCase';
import { ResponseMessageHelper } from '../../../shared/helpers/ResponseMessageHelper';

export class EventController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await CreateEventUseCase.execute(req.body);
      return ResponseMessageHelper.success(res, event);
    } catch (err) {
      next(err);
    }
  }

  static async sell(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await SellTicketUseCase.execute(Number(req.params.id));
      return ResponseMessageHelper.success(res, { message: 'Ticket sold', ticket });
    } catch (err) {
      next(err);
    }
  }

  static async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const event = await GetEventDetailUseCase.execute(id);
      return ResponseMessageHelper.success(res, event);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await UpdateEventUseCase.execute(Number(req.params.id), req.body);
      return ResponseMessageHelper.success(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await DeleteEventUseCase.execute(Number(req.params.id));
      return ResponseMessageHelper.success(res, null);
    } catch (err) {
      next(err);
    }
  }
}
