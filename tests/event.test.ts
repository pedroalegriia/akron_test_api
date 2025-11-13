import { CreateEventUseCase } from '../src/application/usecases/CreateEventUseCase';
import { UpdateEventUseCase } from '../src/application/usecases/UpdateEventUseCase';
import { SellTicketUseCase } from '../src/application/usecases/SellTicketUseCase';
import { RedeemTicketUseCase } from '../src/application/usecases/RedeemTicketUseCase';
import { DeleteEventUseCase } from '../src/application/usecases/DeleteEventUseCase';
import { ValidationException } from '../src/shared/domain/exceptions/ValidationException';

jest.mock('../src/infrastructure/repositories/MysqlEventRepository');
jest.mock('../src/infrastructure/repositories/MysqlTicketRepository');

import { MysqlEventRepository } from '../src/infrastructure/repositories/MysqlEventRepository';
import { MysqlTicketRepository } from '../src/infrastructure/repositories/MysqlTicketRepository';

describe('UseCases - business rules', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('create event with past start date should throw validation error', async () => {
    try {
      await CreateEventUseCase.execute({
        name: 'x',
        start_date: '2000-01-01',
        end_date: '2000-01-02',
        total_tickets: 10
      } as any);
    } catch (err: any) {
      expect(err).toBeInstanceOf(ValidationException);
      expect(err.errors).toEqual([
        { field: 'start_date', message: 'Start date must be today or later' }
      ]);
    }
  });

  test('cannot reduce total_tickets below sold', async () => {
    (MysqlEventRepository as any).findById.mockResolvedValue({ id:1, start_date: '2099-01-01', end_date: '2099-01-02', total_tickets: 100 });
    (MysqlEventRepository as any).countSoldTickets.mockResolvedValue(50);
    try {
      await UpdateEventUseCase.execute(1, { total_tickets: 40 });
    } catch (err: any) {
      expect(err).toBeInstanceOf(ValidationException);
      expect(err.errors).toEqual([
        { field: 'total_tickets', message: 'Cannot reduce total_tickets below already sold tickets' }
      ]);
    }
  });

  test('sell ticket when none available should throw', async () => {
    (MysqlEventRepository as any).findById.mockResolvedValue({ id:2, total_tickets: 1 });
    (MysqlEventRepository as any).countSoldTickets.mockResolvedValue(1);
    try {
      await SellTicketUseCase.execute(2);
    } catch (err: any) {
      expect(err).toBeInstanceOf(ValidationException);
      expect(err.errors).toEqual([
        { field: 'tickets', message: 'No tickets available' }
      ]);
    }
  });

  test('redeem ticket outside dates should throw', async () => {
    (MysqlTicketRepository as any).findByCode.mockResolvedValue({ id:1, event_id:3, code:'T1', is_redeemed:false });
    (MysqlEventRepository as any).findById.mockResolvedValue({ id:3, start_date: '2099-01-02', end_date: '2099-01-03' });

    const RealDate = Date as any;
    global.Date = class extends RealDate {
      constructor(...args: any[]) {
        if (args.length === 0) {
          super('2099-01-01T00:00:00Z');
        } else {
          super(...args);
        }
      }
    } as any;

    try {
      await RedeemTicketUseCase.execute('T1');
    } catch (err: any) {
      expect(err).toBeInstanceOf(ValidationException);
      expect(err.errors).toEqual([
        { field: 'code', message: 'Cannot redeem outside event dates' }
      ]);
    }

    global.Date = RealDate;
  });

  test('delete event with sold tickets and not finished should throw', async () => {
    (MysqlEventRepository as any).findById.mockResolvedValue({ id:4, end_date: '2099-12-31' });
    (MysqlEventRepository as any).countSoldTickets.mockResolvedValue(5);

    try {
      await DeleteEventUseCase.execute(4);
    } catch (err: any) {
      expect(err).toBeInstanceOf(ValidationException);
      expect(err.errors).toEqual([
        { field: 'id', message: 'Cannot delete event: either it must have finished or have zero tickets sold' }
      ]);
    }
  });
});
