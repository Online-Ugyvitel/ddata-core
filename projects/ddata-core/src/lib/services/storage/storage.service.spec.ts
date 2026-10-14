import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let changes: number;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    changes = 0;
    service.watchStorage().subscribe(() => changes++);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('setItem should add the item to localStorage and notify the watchers', () => {
    service.setItem('sample-key', 'sample text');

    expect(localStorage.length).toBe(1);
    expect(localStorage.getItem('sample-key')).toBe('sample text');
    expect(changes).toBe(1);
  });

  it('removeItem should remove only the given item from localStorage and notify the watchers', () => {
    service.setItem('sample-key', 'sample text');
    service.setItem('other-key', 'other text');

    service.removeItem('sample-key');

    expect(localStorage.getItem('sample-key')).toBeNull();
    expect(localStorage.getItem('other-key')).toBe('other text');
    expect(changes).toBe(3);
  });

  it('clear should remove everything from localStorage and notify the watchers', () => {
    service.setItem('sample-key1', 'sample text');
    service.setItem('sample-key2', 'sample text');
    service.setItem('sample-key3', 'sample text');

    expect(localStorage.length).toBe(3);

    service.clear();

    expect(localStorage.length).toBe(0);
    expect(changes).toBe(4);
  });
});
