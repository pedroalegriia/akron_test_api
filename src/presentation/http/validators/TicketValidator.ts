const { body, param } = require('express-validator');

export const sellTicketValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid event ID')
];

export const redeemTicketValidator = [
  param('code')
    .custom((value:any) => {
      if (!value || typeof value !== 'string' || value.trim() === '') {
        throw new Error('Ticket code is required');
      }
      return true;
    })
];

