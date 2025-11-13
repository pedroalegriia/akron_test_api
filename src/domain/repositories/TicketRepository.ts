import { Ticket } from '../models/Ticket';

export interface TicketRepository {
  create(ticket: Ticket): Promise<Ticket>;
  findByCode(code: string): Promise<Ticket | null>;
  redeem(code: string): Promise<Ticket | null>;
  countRedeemed(eventId: number): Promise<number>;
}
