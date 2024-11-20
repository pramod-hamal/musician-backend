import { AppPagination } from './app-pagination';
import { AppResponse } from './app-response';
import { IPaginationData, IPaginationQuery } from './pagination-data.interface';

export abstract class ApiResponse {
  constructor() {}
  static success<TData>(
    data: TData,
    statusCode: number = 200,
    message: string = 'success',
  ) {
    return new AppResponse({
      data: data,
      statusCode,
      message,
    });
  }

  static pagination(
    paginationData: IPaginationData,
    query: IPaginationQuery,
    statusCode: number = 200,
    message: string = 'success',
  ) {
    return new AppPagination({
      ...paginationData,
      ...query,
      statusCode,
      message: message,
    });
  }
}
