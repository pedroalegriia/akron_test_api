import { getPool } from '../database/connection';
import { Event } from '../../domain/models/Event';

export class MysqlEventRepository {
  static async create({ name, start_date, end_date, total_tickets }: Event): Promise<Event> {
    const pool = getPool();
    const [result]: any = await pool.query(
      'INSERT INTO events (name, start_date, end_date, total_tickets) VALUES (?, ?, ?, ?)',
      [name, start_date, end_date, total_tickets]
    );
    return { id: result.insertId, name, start_date, end_date, total_tickets };
  }

  static async findById(id: number): Promise<Event | null> {
    const pool = getPool();
    const [rows]: any = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    const r = rows[0];
    return { id: r.id, name: r.name, start_date: r.start_date, end_date: r.end_date, total_tickets: r.total_tickets };
  }

  static async update(id: number, patch: Partial<Event>): Promise<Event | null> {
    const pool = getPool();
    const fields: string[] = [];
    const values: any[] = [];
    for (const key of Object.keys(patch)) {
      fields.push(`${key} = ?`);
      values.push((patch as any)[key]);
    }
    if (fields.length === 0) return this.findById(id);
    values.push(id);
    await pool.query(`UPDATE events SET ${fields.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  static async delete(id: number): Promise<void> {
    const pool = getPool();
    await pool.query('DELETE FROM events WHERE id = ?', [id]);
    return;
  }

  static async countSoldTickets(eventId: number): Promise<number> {
    const pool = getPool();
    const [rows]: any = await pool.query('SELECT COUNT(*) as sold FROM tickets WHERE event_id = ?', [eventId]);
    return Number(rows[0].sold || 0);
  }
}
