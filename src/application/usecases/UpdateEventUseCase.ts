import { MysqlEventRepository } from '../../infrastructure/repositories/MysqlEventRepository';
import { NotFoundException } from '../../shared/domain/exceptions/NotFoundException';
import { ValidationException } from '../../shared/domain/exceptions/ValidationException';

export class UpdateEventUseCase {
  static async execute(id: number, patch: any) {
    const event = await MysqlEventRepository.findById(id);
    if (!event) throw new NotFoundException('id', 'Event not found');

    const errors: { field: string; message: string }[] = [];
    const now = new Date();
    const normalizeToLocalMidnight = (input: string | Date): Date => {
      const d = new Date(input);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    };

    const start = patch.start_date ? normalizeToLocalMidnight(patch.start_date) : normalizeToLocalMidnight(event.start_date);
    const end = patch.end_date ? normalizeToLocalMidnight(patch.end_date) : normalizeToLocalMidnight(event.end_date);

    if (patch.start_date && start < normalizeToLocalMidnight(now)) {
      errors.push({ field: 'start_date', message: 'Start date must be today or later' });
    }

    if (end < start) {
      errors.push({ field: 'end_date', message: 'End date must be after start date' });
    }

    if (patch.total_tickets !== undefined) {
      if (patch.total_tickets < 1 || patch.total_tickets > 300) {
        errors.push({ field: 'total_tickets', message: 'Total tickets must be between 1 and 300' });
      } else {
        const sold = await MysqlEventRepository.countSoldTickets(id);
        if (patch.total_tickets < sold) {
          errors.push({ field: 'total_tickets', message: 'Cannot reduce total_tickets below already sold tickets' });
        }
      }
    }

    if (errors.length > 0) {
      throw new ValidationException('Validation failed', errors);
    }

    return await MysqlEventRepository.update(id, patch);
  }
}
