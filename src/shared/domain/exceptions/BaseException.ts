export abstract class BaseException extends Error {
  public readonly field?: string;
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 400, field?: string) {
    super(message);
    this.field = field;
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
