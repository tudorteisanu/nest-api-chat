import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function PaginationParamsApiDocs() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      description: 'page',
      schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
      example: 1,
    }),
    ApiQuery({
      name: 'itemsPerPage',
      required: false,
      description: 'Items per page',
      schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
      example: 10,
    }),
  );
}
