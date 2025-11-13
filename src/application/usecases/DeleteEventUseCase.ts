import { MysqlEventRepository } from '../../infrastructure/repositories/MysqlEventRepository';
import { NotFoundException } from '../../shared/domain/exceptions/NotFoundException';
import { ValidationException } from '../../shared/domain/exceptions/ValidationException';

export class DeleteEventUseCase {
  static async execute(id: number) {
    const event = await MysqlEventRepository.findById(id);
    if (!event) throw new NotFoundException('id', 'Event not found');

    const sold = await MysqlEventRepository.countSoldTickets(id);
    const now = new Date();
    const eventEnd = new Date(event.end_date);

    if (eventEnd >= now && sold > 0) {
      throw new ValidationException('Validation failed', [
        {
          field: 'id',
          message: 'Cannot delete event: either it must have finished or have zero tickets sold'
        }
      ]);
    }

    await MysqlEventRepository.delete(id);
    return;
  }
}
