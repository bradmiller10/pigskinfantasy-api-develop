import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ERROR_CODE_TO_HTTP_CODE } from '../enums';

/**
 * Overrides the default HttpException to provide our specific ErrorCodes for proper debugging
 *
 * @docs https://docs.nestjs.com/v5/exception-filters
 * @author jordanskomer
 * @since 0.0.1
 */
export class Exception extends HttpException {
  constructor(errorCode: ErrorCode, message?: string, additionalInfo?: Record<string, any>) {
    const statusCode = ERROR_CODE_TO_HTTP_CODE[errorCode] || HttpStatus.BAD_REQUEST;
    super(
      {
        message,
        errorCode,
        additionalInfo,
        statusCode,
      },
      statusCode,
    );
  }
}
