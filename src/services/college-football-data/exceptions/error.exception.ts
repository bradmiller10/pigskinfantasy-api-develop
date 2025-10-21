import { ErrorCode, Exception } from 'src/typings';

export class Error extends Exception {
  constructor(message?: string, additionalInfo?: Record<string, any>) {
    super(ErrorCode.CollegeFootballApiError, message, additionalInfo);
  }
}
