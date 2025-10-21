import { ExceptionFilter, Catch } from '@nestjs/common';
import { QueryException } from 'src/typings/exceptions/query-error.exception';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
  catch(exception: QueryFailedError) {
    throw new QueryException(exception);
  }
}
