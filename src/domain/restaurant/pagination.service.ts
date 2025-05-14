import { Injectable } from '@nestjs/common';
import { Request } from 'express'; // Explicitly import Express Request type

@Injectable()
export class PaginationService {
  generatePaginationMetadata(
    request: Request, // Use express.Request
    currentPage: number,
    totalItems: number,
    itemsPerPage: number,
  ) {
    const url = request.url;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const links = {
      self: `${url}?page=${currentPage}&limit=${itemsPerPage}`,
    };
    if (currentPage < totalPages) {
      links['next'] = `${url}?page=${currentPage + 1}&limit=${itemsPerPage}`;
    }
    if (currentPage > 1) {
      links['prev'] = `${url}?page=${currentPage - 1}&limit=${itemsPerPage}`;
    }
    links['last'] = `${url}?page=${totalPages}&limit=${itemsPerPage}`;
    const meta = {
      totalItems,
      currentPage,
      totalPages,
      itemsPerPage,
    };
    return { links, meta };
  }
}