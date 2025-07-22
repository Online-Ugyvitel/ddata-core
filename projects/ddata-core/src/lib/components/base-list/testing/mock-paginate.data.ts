import { PaginateInterface } from '../../../models/paginate/paginate.interface';
import { TestModel } from './test-model.class';

// Mock PaginateInterface implementation
export const mockPaginate: PaginateInterface = {
  current_page: 1,
  per_page: 10,
  from: 1,
  to: 10,
  total: 100,
  last_page: 10,
  data: []
};

export const mockPaginateWithData: PaginateInterface = {
  current_page: 1,
  per_page: 10,
  from: 1,
  to: 10,
  total: 100,
  last_page: 10,
  data: [new TestModel().init({ id: 1, name: 'Test Item' })]
};