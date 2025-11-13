import { Request, Response, NextFunction } from 'express';
import { RedeemTicketUseCase } from '../../../application/usecases/RedeemTicketUseCase';
import { SellTicketUseCase } from '../../../application/usecases/SellTicketUseCase';
import { ResponseMessageHelper } from '../../../shared/helpers/ResponseMessageHelper';

export class TicketController {
  static async redeem(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.params;
      const ticket = await RedeemTicketUseCase.execute(code);
      return ResponseMessageHelper.success(res, ticket, 'Ticket redeemed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async sell(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const ticket = await SellTicketUseCase.execute(Number(id));
      return ResponseMessageHelper.success(res, ticket, 'Ticket sold successfully');
    } catch (error) {
      next(error);
    }
  }
}
