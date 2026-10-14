import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let emitted: Array<boolean>;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [StorageService]
    });

    service = TestBed.inject(StorageService);
    emitted = [];
    service.watchStorage().subscribe((value: boolean) => emitted.push(value));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be provided in root as a singleton', () => {
    expect(TestBed.inject(StorageService)).toBe(service);
  });

  it('watchStorage should not emit before any storage change', () => {
    expect(emitted).toEqual([]);
  });

  it('setItem should store the value in localStorage and notify the watchers', () => {
    service.setItem('sample-key', 'sample text');

    expect(localStorage.length).toBe(1);
    expect(localStorage.getItem('sample-key')).toBe('sample text');
    expect(emitted).toEqual([true]);
  });

  it('setItem should overwrite an existing value', () => {
    service.setItem('sample-key', 'first');
    service.setItem('sample-key', 'second');

    expect(localStorage.length).toBe(1);
    expect(localStorage.getItem('sample-key')).toBe('second');
    expect(emitted).toEqual([true, true]);
  });

  it('setItem should store non-string values as strings', () => {
    service.setItem('number-key', 42);

    expect(localStorage.getItem('number-key')).toBe('42');
  });

  it('removeItem should remove only the given item and notify the watchers', () => {
    localStorage.setItem('sample-key', 'sample text');
    localStorage.setItem('other-key', 'other text');

    service.removeItem('sample-key');

    expect(localStorage.getItem('sample-key')).toBeNull();
    expect(localStorage.getItem('other-key')).toBe('other text');
    expect(emitted).toEqual([true]);
  });

  it('removeItem should notify the watchers even if the key does not exist', () => {
    service.removeItem('missing-key');

    expect(localStorage.length).toBe(0);
    expect(emitted).toEqual([true]);
  });

  it('clear should remove everything from localStorage and notify the watchers', () => {
    service.setItem('sample-key1', 'sample text');
    service.setItem('sample-key2', 'sample text');
    service.setItem('sample-key3', 'sample text');

    expect(localStorage.length).toBe(3);

    service.clear();

    expect(localStorage.length).toBe(0);
    expect(emitted).toEqual([true, true, true, true]);
  });

  it('watchStorage should notify every subscriber', () => {
    const otherEmitted: Array<boolean> = [];

    service.watchStorage().subscribe((value: boolean) => otherEmitted.push(value));
    service.setItem('sample-key', 'sample text');

    expect(emitted).toEqual([true]);
    expect(otherEmitted).toEqual([true]);
  });

  it('watchStorage should not notify after unsubscribing', () => {
    const otherEmitted: Array<boolean> = [];
    const subscription = service
      .watchStorage()
      .subscribe((value: boolean) => otherEmitted.push(value));

    subscription.unsubscribe();
    service.clear();

    expect(otherEmitted).toEqual([]);
    expect(emitted).toEqual([true]);
  });
});
