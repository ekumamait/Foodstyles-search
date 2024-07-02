import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

/**
 * Get pagination information from query parameters
 */
export const PaginationQuery = createParamDecorator(
  (_data: unknown, context: ExecutionContext): IPaginationOptions => {
    const request: Request = context.switchToHttp().getRequest();
    return {
      page: Number(request.query.page) || 1,
      limit: Number(request.query.limit || 25),
    };
  },
);
