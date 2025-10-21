import { HttpException, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { ErrorCode } from '../enums';

/**
 * Overrides the default HttpException to provide our specific ErrorCodes for proper debugging
 *
 * @docs https://docs.nestjs.com/v5/exception-filters
 * @author jordanskomer
 * @since 0.0.1
 */
export class QueryException extends HttpException {
  constructor(e: QueryFailedError) {
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    super(
      {
        message: e.message,
        errorCode: ErrorCode.InvalidQuery,
        statusCode,
        info: e,
      },
      statusCode,
    );
  }
}
