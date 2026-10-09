import { of } from 'rxjs';

// Mock HelperService for testing
export class MockHelperService {
  getAll = vi.fn().mockReturnValue(of({ data: [], total: 0 }));
  search = vi.fn().mockReturnValue(of({ data: [], total: 0 }));
  booleanChange = vi.fn().mockReturnValue(of(true));
  edit = vi.fn();
  delete = vi.fn().mockReturnValue(of(true));
  deleteMultiple = vi.fn().mockReturnValue(of(true));
  save = vi.fn().mockReturnValue(of({}));
  saveAsNew = vi.fn().mockReturnValue(of({}));
  stepBack = vi.fn();
  changeToPage = vi.fn().mockReturnValue(of({}));
  getOne = vi.fn().mockReturnValue(of({}));
  searchWithoutPaginate = vi.fn().mockReturnValue(of([]));
}
