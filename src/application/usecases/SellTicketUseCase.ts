import { MysqlEventRepository } from '../../infrastructure/repositories/MysqlEventRepository';
import { MysqlTicketRepository } from '../../infrastructure/repositories/MysqlTicketRepository';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '../../shared/domain/exceptions/NotFoundException';
import { ValidationException } from '../../shared/domain/exceptions/ValidationException';

export class SellTicketUseCase {
  static async execute(eventId: number) {
    const event = await MysqlEventRepository.findById(eventId);
    if (!event) throw new NotFoundException('id', 'Event not found');

    const sold = await MysqlEventRepository.countSoldTickets(eventId);
    if (sold >= event.total_tickets) {
      throw new ValidationException('Validation failed', [
        { field: 'tickets', message: 'No tickets available' }
      ]);
    }

    const code = `TCK-${uuidv4()}`;
    const ticket = await MysqlTicketRepository.create({ event_id: eventId, code });

    return ticket;
  }
}
