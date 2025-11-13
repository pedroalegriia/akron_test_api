import { getPool } from '../database/connection';
import { Ticket } from '../../domain/models/Ticket';

export class MysqlTicketRepository {
  static async create({ event_id, code }: Ticket): Promise<Ticket> {
    const pool = getPool();
    const [result]: any = await pool.query(
      'INSERT INTO tickets (event_id, code) VALUES (?, ?)',
      [event_id, code]
    );
    return { id: result.insertId, event_id, code, is_redeemed: false };
  }

  static async findByCode(code: string): Promise<Ticket | null> {
    const pool = getPool();
    const [rows]: any = await pool.query('SELECT * FROM tickets WHERE code = ?', [code]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return { id: r.id, event_id: r.event_id, code: r.code, is_redeemed: !!r.is_redeemed, redeemed_at: r.redeemed_at };
  }

  static async redeem(code: string): Promise<Ticket | null> {
    const pool = getPool();
    const now = new Date();
    await pool.query('UPDATE tickets SET is_redeemed = TRUE, redeemed_at = ? WHERE code = ?', [now, code]);
    return this.findByCode(code);
  }

  static async countRedeemed(eventId: number): Promise<number> {
    const pool = getPool();
    const [rows]: any = await pool.query('SELECT COUNT(*) as redeemed FROM tickets WHERE event_id = ? AND is_redeemed = 1', [eventId]);
    return Number(rows[0].redeemed || 0);
  }
}
