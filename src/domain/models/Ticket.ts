export interface Ticket {
  id?: number;
  event_id: number;
  code: string;
  is_redeemed?: boolean;
  redeemed_at?: string | Date | null;
}
