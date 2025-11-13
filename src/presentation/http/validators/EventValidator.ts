const { body, param } = require('express-validator');
import { Request } from 'express';

function validateDates(startField: string = 'start_date', endField: string = 'end_date') {
  return body(endField).custom((endValue: string, { req }: { req: Request }) => {
    const startValue: string = (req.body as any)[startField];

    if (!startValue) throw new Error('Start date is required');
    if (!endValue) throw new Error('End date is required');

    const normalizeLocalDate = (dateStr: string): Date => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day, 0, 0, 0, 0);
    };

    const start = normalizeLocalDate(startValue);
    const end = normalizeLocalDate(endValue);

    if (isNaN(start.getTime())) throw new Error('Start date must be a valid date (YYYY-MM-DD)');
    if (isNaN(end.getTime())) throw new Error('End date must be a valid date (YYYY-MM-DD)');

    const today = new Date();
    const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (start < localToday) throw new Error('Start date must be today or later');
    if (end < start) throw new Error('End date must be after start date');

    return true;
  });
}

export const createEventValidator = [
  body('name')
    .custom((v: string) => {
      if (!v || typeof v !== 'string' || v.trim() === '') throw new Error('Event name is required');
      return true;
    }),

  body('start_date')
    .custom((value: string) => {
      if (!value || typeof value !== 'string' || value.trim() === '') throw new Error('Start date must be a valid date (YYYY-MM-DD)');
      return true;
    }),

  body('end_date')
    .custom((value: string) => {
      if (!value || typeof value !== 'string' || value.trim() === '') throw new Error('End date must be a valid date (YYYY-MM-DD)');
      return true;
    }),

  validateDates('start_date', 'end_date'),

  body('total_tickets')
    .custom((v: string | number) => {
      const num = Number(v);
      if (!Number.isInteger(num) || num < 1 || num > 300)
        throw new Error('Total tickets must be between 1 and 300');
      return true;
    })
];

export const updateEventValidator = [
  param('id')
    .custom((v: string | number) => {
      const n = Number(v);
      if (!Number.isInteger(n) || n < 1) throw new Error('Invalid event ID');
      return true;
    }),

  body('name')
    .optional()
    .custom((v?: string) => {
      if (v === undefined) return true;
      if (!v || typeof v !== 'string' || v.trim() === '') throw new Error('Event name must be a non-empty string');
      return true;
    }),

  body('start_date')
    .optional()
    .custom((value?: string) => {
      if (value === undefined) return true;
      if (!value || typeof value !== 'string' || value.trim() === '') throw new Error('Start date must be a valid date (YYYY-MM-DD)');
      const d = new Date(value);
      if (isNaN(d.getTime())) throw new Error('Start date must be a valid date (YYYY-MM-DD)');
      const today = new Date(); today.setHours(0,0,0,0);
      const startDay = new Date(value); startDay.setHours(0,0,0,0);
      if (startDay < today) throw new Error('Start date must be today or later');
      return true;
    }),

  body('end_date')
    .optional()
    .custom((value?: string) => {
      if (value === undefined) return true;
      if (!value || typeof value !== 'string' || value.trim() === '') throw new Error('End date must be a valid date (YYYY-MM-DD)');
      const d = new Date(value);
      if (isNaN(d.getTime())) throw new Error('End date must be a valid date (YYYY-MM-DD)');
      return true;
    }),

  body().custom((_: unknown, { req }: { req: Request }) => {
    const hasStart = req.body.start_date !== undefined;
    const hasEnd = req.body.end_date !== undefined;

    if (hasStart && hasEnd) {
      const start = new Date(req.body.start_date);
      const end = new Date(req.body.end_date);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Start date and end date must be valid dates');
      }

      if (start < new Date(new Date().setHours(0,0,0,0))) {
        throw new Error('Start date must be today or later');
      }

      if (end < start) {
        throw new Error('End date must be after start date');
      }
    }

    return true;
  }),
  body('total_tickets')
    .optional()
    .custom((v?: string | number) => {
      if (v === undefined) return true;
      const num = Number(v);
      if (!Number.isInteger(num) || num < 1 || num > 300) throw new Error('Total tickets must be between 1 and 300');
      return true;
    })
];

export const sellEventValidator = [
  param('id')
    .custom((v: string | number) => {
      const n = Number(v);
      if (!Number.isInteger(n) || n < 1) throw new Error('Invalid event ID');
      return true;
    })
];

export const detailEventValidator = [
  param('id')
    .custom((v: string | number) => {
      const n = Number(v);
      if (!Number.isInteger(n) || n < 1) throw new Error('Invalid event ID');
      return true;
    })
];

export const deleteEventValidator = [
  param('id')
    .custom((v: string | number) => {
      const n = Number(v);
      if (!Number.isInteger(n) || n < 1) throw new Error('Invalid event ID');
      return true;
    })
];
