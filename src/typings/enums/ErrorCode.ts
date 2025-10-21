import { HttpStatus } from '@nestjs/common';

export const enum ErrorCode {
  NotFound = 'NOT_FOUND',
  InvalidPayload = 'INVALID_PAYLOAD',
  NoModelSeeds = 'NO_MODEL_SEEDS',
  InvalidQuery = 'INVALID_QUERY',
  ServerError = 'SERVER_ERROR',
  CollegeFootballApiError = 'COLLEGE_FOOTBALL_API_ERROR',
}
/**
 * Used to define our HTTP error codes to go with our internal ErrorCodes. By default
 * we pass a 400 error code back unless another one is defined below
 *
 * @author jordanskomer
 * @since 0.0.1
 */
export const ERROR_CODE_TO_HTTP_CODE: Partial<Record<ErrorCode, HttpStatus>> = {
  NOT_FOUND: HttpStatus.NOT_FOUND,
};
