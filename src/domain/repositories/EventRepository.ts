import { Event } from '../models/Event';

export interface EventRepository {
  create(event: Event): Promise<Event>;
  update(id: number, patch: Partial<Event>): Promise<Event | null>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Event | null>;
  countSoldTickets(eventId: number): Promise<number>;
}
