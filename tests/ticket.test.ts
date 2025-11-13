import { SellTicketUseCase } from '../src/application/usecases/SellTicketUseCase';
import { MysqlEventRepository } from '../src/infrastructure/repositories/MysqlEventRepository';
import { MysqlTicketRepository } from '../src/infrastructure/repositories/MysqlTicketRepository';
import { ValidationException } from '../src/shared/domain/exceptions/ValidationException';

jest.mock('../src/infrastructure/repositories/MysqlEventRepository');
jest.mock('../src/infrastructure/repositories/MysqlTicketRepository');

describe('SellTicketUseCase', () => {
  beforeEach(() => jest.clearAllMocks());

  test('sells a ticket when available', async () => {
    (MysqlEventRepository as any).findById.mockResolvedValue({ id:5, total_tickets: 2 });
    (MysqlEventRepository as any).countSoldTickets.mockResolvedValue(1);
    (MysqlTicketRepository as any).create.mockResolvedValue({ id:10, event_id:5, code:'TCK-123' });

    const ticket = await SellTicketUseCase.execute(5);
    expect(ticket).toHaveProperty('code');
    expect(ticket.code).toBe('TCK-123');
  });

  test('throws ValidationException when no tickets available', async () => {
    (MysqlEventRepository as any).findById.mockResolvedValue({ id:5, total_tickets: 2 });
    (MysqlEventRepository as any).countSoldTickets.mockResolvedValue(2);

    try {
      await SellTicketUseCase.execute(5);
    } catch (err: any) {
      expect(err).toBeInstanceOf(ValidationException);
      expect(err.errors).toEqual([
        { field: 'tickets', message: 'No tickets available' }
      ]);
    }
  });
});
