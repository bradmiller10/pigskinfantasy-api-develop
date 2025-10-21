import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthErrorCode } from '../enums';

/**
 * Overrides the default HttpException for any auth errors
 *
 * @docs https://docs.nestjs.com/v5/exception-filters
 * @author jordanskomer
 * @since 0.0.1
 */
export class AuthException extends HttpException {
  constructor(errorCode: AuthErrorCode, message?: string, additionalInfo?: Record<string, any>) {
    const statusCode = HttpStatus.UNAUTHORIZED;
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
