export interface Event {
  id?: number;
  name: string;
  start_date: string | Date;
  end_date: string | Date;
  total_tickets: number;
  tickets_sold?: number;
  tickets_redeemed?: number;

}
