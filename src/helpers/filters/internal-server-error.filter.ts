import { ExceptionFilter, Catch, InternalServerErrorException } from '@nestjs/common';
import { ErrorCode } from 'src/typings/enums';
import { Exception } from 'src/typings/exceptions';

@Catch(InternalServerErrorException)
export class InternalServerErrorFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException) {
    throw new Exception(ErrorCode.ServerError, exception.message, exception);
  }
}
