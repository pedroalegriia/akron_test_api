import { BaseException } from './BaseException';

export class BadRequestException extends BaseException {
  constructor(field: string, message: string = 'Invalid request') {
    super(message, 400, field);
  }
}
