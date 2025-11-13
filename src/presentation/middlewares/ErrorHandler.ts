import { Request, Response, NextFunction } from 'express';
import { BaseException } from '../../shared/domain/exceptions/BaseException';

import { ValidationException } from '../../shared/domain/exceptions/ValidationException';
import { ResponseMessageHelper } from '../../shared/helpers/ResponseMessageHelper';

export default function ErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(`[ErrorHandler]`, err);

  if (res.headersSent) return next(err);

  if (err instanceof ValidationException) {
    return ResponseMessageHelper.error(res, err);
  }

  if (err instanceof BaseException) {
    return ResponseMessageHelper.error(res, err);
  }

  return ResponseMessageHelper.error(res, {
    message: 'Internal server error',
    statusCode: 500
  });
}
