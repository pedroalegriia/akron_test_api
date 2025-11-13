import { BaseException } from './BaseException';

export class NotFoundException extends BaseException {
  constructor(field: string, message: string = 'Resource not found') {
    super(message, 404, field);
  }
}
