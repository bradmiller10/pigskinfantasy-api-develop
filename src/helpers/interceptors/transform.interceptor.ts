import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    responseTime: number;
    itemsPerPage?: number;
    totalPages?: number;
    currentPage?: number;
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const now = new Date().getTime();
    return next.handle().pipe(
      map((data) => {
        const items = Array.isArray(data) ? (data as T[]) : [data];
        // Handle pagination
        if (typeof items[0] === 'object' && items[0]['items'] && items[0]['meta']) {
          const paginatedData = data as unknown as Response<T>;
          return {
            items: paginatedData.items,
            meta: {
              ...paginatedData.meta,
              responseTime: new Date().getTime() - now,
            },
          };
        }
        return {
          items,
          meta: {
            totalItems: items.length,
            itemCount: items.length,
            responseTime: new Date().getTime() - now,
          },
        };
      }),
    );
  }
}
