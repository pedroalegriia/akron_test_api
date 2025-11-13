import { MysqlEventRepository } from '../../infrastructure/repositories/MysqlEventRepository';
import { MysqlTicketRepository } from '../../infrastructure/repositories/MysqlTicketRepository';
import { NotFoundException } from '../../shared/domain/exceptions/NotFoundException';

export class GetEventDetailUseCase {
  static async execute(eventId: number) {
    const event = await MysqlEventRepository.findById(eventId);
    if (!event) throw new NotFoundException('id', 'Event not found');

    const sold = await MysqlEventRepository.countSoldTickets(eventId);
    const redeemed = await MysqlTicketRepository.countRedeemed(eventId);

    return {
      id: event.id,
      name: event.name,
      start_date: event.start_date,
      end_date: event.end_date,
      total_tickets: event.total_tickets,
      tickets_sold: Number(sold),
      tickets_redeemed: Number(redeemed)
    };
  }
}
