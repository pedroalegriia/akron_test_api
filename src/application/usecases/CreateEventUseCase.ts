import { MysqlEventRepository } from '../../infrastructure/repositories/MysqlEventRepository';
import { Event } from '../../domain/models/Event';
import { ValidationException } from '../../shared/domain/exceptions/ValidationException';

export class CreateEventUseCase {
  static async execute({ name, start_date, end_date, total_tickets }: Event): Promise<Event> {

    const normalizeToLocalMidnight = (input: string | Date): Date => {
      const d = new Date(input);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()); 
    };

    const start = normalizeToLocalMidnight(start_date);
    const end = normalizeToLocalMidnight(end_date);

    const today = new Date();
    const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const errors: { field: string; message: string }[] = [];

    if (start < localToday) {
      errors.push({ field: 'start_date', message: 'Start date must be today or later' });
    }

    if (end < start) {
      errors.push({ field: 'end_date', message: 'End date must be after start date' });
    }

    if (total_tickets < 1 || total_tickets > 300) {
      errors.push({ field: 'total_tickets', message: 'Total tickets must be between 1 and 300' });
    }

    if (errors.length > 0) {
      throw new ValidationException('Validation failed', errors);
    }

    return await MysqlEventRepository.create({
      name,
      start_date,
      end_date,
      total_tickets,
    });
  }
}
