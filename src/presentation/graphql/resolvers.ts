import { GetEventDetailUseCase } from '../../application/usecases/GetEventDetailUseCase';
import { CreateEventUseCase } from '../../application/usecases/CreateEventUseCase';
import { UpdateEventUseCase } from '../../application/usecases/UpdateEventUseCase';
import { DeleteEventUseCase } from '../../application/usecases/DeleteEventUseCase';
import { SellTicketUseCase } from '../../application/usecases/SellTicketUseCase';
import { RedeemTicketUseCase } from '../../application/usecases/RedeemTicketUseCase';
import { ValidationException } from '../../shared/domain/exceptions/ValidationException';


export const resolvers = {
    Query: {
        getEvent: async (_: any, { id }: { id: number }) => {
            return await GetEventDetailUseCase.execute(Number(id));
        },
        getTicket: async (_: any, { code }: { code: string }) => {
            return await RedeemTicketUseCase.execute(code);
        },
    },
    Mutation: {
        createEvent: async (_: any, args: { name: string; start_date: string; end_date: string; total_tickets: number }) => {
            const event = await CreateEventUseCase.execute({
                name: args.name,
                start_date: args.start_date,
                end_date: args.end_date,
                total_tickets: args.total_tickets
            });
            return {
                ...event,
                tickets_sold: 0,
                tickets_redeemed: 0
            };
        },
        updateEvent: async (
            _: any,
            args: { id: number; name?: string; start_date?: string; end_date?: string; total_tickets?: number }
        ) => {
            const { id, ...patch } = args;
            const updated = await UpdateEventUseCase.execute(id, patch);

            if (!updated) {
                throw new Error('Event not found');
            }

            return {
                ...updated,
                tickets_sold: updated.tickets_sold ?? 0,
                tickets_redeemed: updated.tickets_redeemed ?? 0
            };
        },

        deleteEvent: async (_: any, args: { id: number }) => {
            try {
                await DeleteEventUseCase.execute(args.id);
                return {
                    success: true,
                    message: 'Event deleted successfully',
                    errors: []
                };
            } catch (err: any) {

                const errors = err instanceof ValidationException ? err.errors : [];
                return {
                    success: false,
                    message: err.message,
                    errors
                };
            }
        },

        sellTicket: async (_: any, { eventId }: any) => {
            return await SellTicketUseCase.execute(Number(eventId));
        },
        redeemTicket: async (_: any, { code }: any) => {
        try {
            const ticket = await RedeemTicketUseCase.execute(code);
            return {
            success: true,
            message: 'Ticket redeemed successfully',
            ticket
            };
        } catch (err: any) {
            const errors = err.errors ?? [];
            return {
            success: false,
            message: err.message,
            errors
            };
        }
        },

    },
};
