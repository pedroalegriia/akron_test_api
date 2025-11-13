import { Response } from 'express';
import { BaseException } from '../domain/exceptions/BaseException';
import { ValidationException } from '../domain/exceptions/ValidationException';

export class ResponseMessageHelper {
  static success(res: Response, data: any, message: string = 'Operation successful') {
    return res.status(200).json({
      success: true,
      message,
      data
    });
  }

  static error(res: Response, error: unknown) {
    if (error instanceof ValidationException) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors
      });
    }

    if (error instanceof BaseException) {
      return res.status(error.statusCode).json({
        success: false,
        message: 'Validation failed',
        errors: [{ field: error.field, message: error.message }]
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
