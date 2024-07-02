import { _200 } from '../constants/response-messages';

export class PaginatedDataResponseDto<T> {
  message: string;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  data: T[];

  constructor(
    message: string,
    totalItems: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number,
    data: T[],
  ) {
    this.message = message;
    this.totalItems = totalItems;
    this.itemsPerPage = itemsPerPage;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.data = data;
  }

  static create<T>(
    totalItems: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number,
    data: T[],
    message = _200.REQUEST_SUCCESSFUL.message,
  ): PaginatedDataResponseDto<T> {
    return new PaginatedDataResponseDto<T>(
      message,
      totalItems,
      itemsPerPage,
      totalPages,
      currentPage,
      data,
    );
  }
}
