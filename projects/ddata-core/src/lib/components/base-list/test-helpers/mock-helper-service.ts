import { of } from 'rxjs';

// Mock HelperService for testing
export class MockHelperService {
  getAll = jasmine.createSpy('getAll').and.returnValue(of({ data: [], total: 0 }));
  search = jasmine.createSpy('search').and.returnValue(of({ data: [], total: 0 }));
  booleanChange = jasmine.createSpy('booleanChange').and.returnValue(of(true));
  edit = jasmine.createSpy('edit');
  delete = jasmine.createSpy('delete').and.returnValue(of(true));
  deleteMultiple = jasmine.createSpy('deleteMultiple').and.returnValue(of(true));
  save = jasmine.createSpy('save').and.returnValue(of({}));
  saveAsNew = jasmine.createSpy('saveAsNew').and.returnValue(of({}));
  stepBack = jasmine.createSpy('stepBack');
  changeToPage = jasmine.createSpy('changeToPage').and.returnValue(of({}));
  getOne = jasmine.createSpy('getOne').and.returnValue(of({}));
  searchWithoutPaginate = jasmine.createSpy('searchWithoutPaginate').and.returnValue(of([]));
}