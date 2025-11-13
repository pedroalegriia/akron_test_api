import { MysqlTicketRepository } from '../../infrastructure/repositories/MysqlTicketRepository';
import { MysqlEventRepository } from '../../infrastructure/repositories/MysqlEventRepository';
import { NotFoundException } from '../../shared/domain/exceptions/NotFoundException';
import { ValidationException } from '../../shared/domain/exceptions/ValidationException';

export class RedeemTicketUseCase {
  static async execute(code: string) {
    const ticket = await MysqlTicketRepository.findByCode(code);
    if (!ticket) throw new NotFoundException('code', 'Ticket not found');

    if (ticket.is_redeemed) {
      throw new ValidationException('Validation failed', [
        {
          field: 'code',
          message: 'Ticket already redeemed'
        }
      ]);
    }

    const event = await MysqlEventRepository.findById(ticket.event_id);
    if (!event) throw new NotFoundException('event_id', 'Event not found');

    const now = new Date();
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);

    if (now < start || now > end) {
      throw new ValidationException('Validation failed', [
        {
          field: 'code',
          message: 'Cannot redeem outside event dates'
        }
      ]);
    }

    return await MysqlTicketRepository.redeem(code);
  }
}
