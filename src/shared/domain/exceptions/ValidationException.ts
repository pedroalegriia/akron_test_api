import { BaseException } from './BaseException';

export class ValidationException extends BaseException {
  public errors: { field: string; message: string }[];

  constructor(message: string, errors: { field: string; message: string }[]) {
    super(message, 400); 
    this.errors = errors;
  }
}
