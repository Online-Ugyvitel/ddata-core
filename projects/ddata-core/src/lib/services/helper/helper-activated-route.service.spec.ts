import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Params } from '@angular/router';
import { HelperActivatedRouteService } from './helper-activated-route.service';

describe('HelperActivatedRouteService', () => {
  let service: HelperActivatedRouteService;
  let originalLocation: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HelperActivatedRouteService]
    });
    service = TestBed.inject(HelperActivatedRouteService);
    
    // Store original location for restoration
    originalLocation = window.location;
  });

  afterEach(() => {
    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true
    });
  });

  /**
   * Helper function to mock window.location.href
   */
  function mockLocation(href: string) {
    delete (window as any).location;
    window.location = { href } as any;
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('params()', () => {
    it('should return Observable<Params> with id from getId()', (done) => {
      mockLocation('http://example.com/some/path/edit/123');
      
      const result: Observable<Params> = service.params();
      
      result.subscribe(params => {
        expect(params).toBeDefined();
        expect(params.id).toBe(123);
        done();
      });
    });

    it('should return Observable<Params> with id 0 when no valid id in URL', (done) => {
      mockLocation('http://example.com/some/path');
      
      const result: Observable<Params> = service.params();
      
      result.subscribe(params => {
        expect(params).toBeDefined();
        expect(params.id).toBe(0);
        done();
      });
    });
  });

  describe('getId()', () => {
    it('should return id from edit URL pattern', () => {
      mockLocation('http://example.com/some/path/edit/123');
      
      const result = service.getId();
      
      expect(result).toBe(123);
    });

    it('should return id from list URL pattern', () => {
      mockLocation('http://example.com/some/path/list/456');
      
      const result = service.getId();
      
      expect(result).toBe(456);
    });

    it('should return 0 when URL does not match edit/list pattern', () => {
      mockLocation('http://example.com/some/path/view/123');
      
      const result = service.getId();
      
      expect(result).toBe(0);
    });

    it('should return 0 when URL ends with edit but no id', () => {
      mockLocation('http://example.com/some/path/edit');
      
      const result = service.getId();
      
      expect(result).toBe(0);
    });

    it('should return 0 when URL ends with list but no id', () => {
      mockLocation('http://example.com/some/path/list');
      
      const result = service.getId();
      
      expect(result).toBe(0);
    });

    it('should return 0 when last segment is not a number after edit', () => {
      mockLocation('http://example.com/some/path/edit/abc');
      
      const result = service.getId();
      
      expect(result).toBe(0);
    });

    it('should return 0 when last segment is not a number after list', () => {
      mockLocation('http://example.com/some/path/list/xyz');
      
      const result = service.getId();
      
      expect(result).toBe(0);
    });

    it('should return 0 for empty URL', () => {
      mockLocation('');
      
      const result = service.getId();
      
      expect(result).toBe(0);
    });

    it('should return 0 for root URL', () => {
      mockLocation('http://example.com/');
      
      const result = service.getId();
      
      expect(result).toBe(0);
    });

    it('should handle URL with only domain', () => {
      mockLocation('http://example.com');
      
      const result = service.getId();
      
      expect(result).toBe(0);
    });

    it('should handle complex URL with edit and numeric id', () => {
      mockLocation('http://example.com/app/module/submodule/edit/999');
      
      const result = service.getId();
      
      expect(result).toBe(999);
    });

    it('should handle complex URL with list and numeric id', () => {
      mockLocation('http://example.com/app/module/submodule/list/888');
      
      const result = service.getId();
      
      expect(result).toBe(888);
    });
  });

  describe('getUniqueListId()', () => {
    it('should return id from list URL pattern', () => {
      mockLocation('http://example.com/some/path/list/123');
      
      const result = service.getUniqueListId();
      
      expect(result).toBe(123);
    });

    it('should return 0 when URL does not contain list', () => {
      mockLocation('http://example.com/some/path/edit/123');
      
      const result = service.getUniqueListId();
      
      expect(result).toBe(0);
    });

    it('should return 0 when list is present but no numeric id after it', () => {
      mockLocation('http://example.com/some/path/list/abc');
      
      const result = service.getUniqueListId();
      
      expect(result).toBe(0);
    });

    it('should return 0 when list is the last segment', () => {
      mockLocation('http://example.com/some/path/list');
      
      const result = service.getUniqueListId();
      
      expect(result).toBe(0);
    });

    it('should handle multiple occurrences of list and use the first one', () => {
      mockLocation('http://example.com/list/456/some/path/list/123');
      
      const result = service.getUniqueListId();
      
      expect(result).toBe(456);
    });

    it('should return 0 for empty URL', () => {
      mockLocation('');
      
      const result = service.getUniqueListId();
      
      expect(result).toBe(0);
    });

    it('should return 0 when URL does not contain list keyword', () => {
      mockLocation('http://example.com/some/path/edit/123');
      
      const result = service.getUniqueListId();
      
      expect(result).toBe(0);
    });

    it('should handle complex URL with list and numeric id', () => {
      mockLocation('http://example.com/app/module/submodule/list/777');
      
      const result = service.getUniqueListId();
      
      expect(result).toBe(777);
    });

    it('should return 0 when list is followed by non-numeric value', () => {
      mockLocation('http://example.com/some/path/list/non-numeric-value');
      
      const result = service.getUniqueListId();
      
      expect(result).toBe(0);
    });
  });

  describe('getUniqueId()', () => {
    it('should return id when lastWord is found followed by numeric id', () => {
      mockLocation('http://example.com/some/path/details/123');
      
      const result = service.getUniqueId('details');
      
      expect(result).toBe(123);
    });

    it('should return 0 when lastWord is not found in URL', () => {
      mockLocation('http://example.com/some/path/edit/123');
      
      const result = service.getUniqueId('details');
      
      expect(result).toBe(0);
    });

    it('should return 0 when lastWord is found but no numeric id after it', () => {
      mockLocation('http://example.com/some/path/details/abc');
      
      const result = service.getUniqueId('details');
      
      expect(result).toBe(0);
    });

    it('should return 0 when lastWord is the last segment', () => {
      mockLocation('http://example.com/some/path/details');
      
      const result = service.getUniqueId('details');
      
      expect(result).toBe(0);
    });

    it('should handle multiple occurrences of lastWord and use the first one', () => {
      mockLocation('http://example.com/details/456/some/path/details/123');
      
      const result = service.getUniqueId('details');
      
      expect(result).toBe(456);
    });

    it('should work with different lastWord values', () => {
      mockLocation('http://example.com/some/path/view/789');
      
      const result = service.getUniqueId('view');
      
      expect(result).toBe(789);
    });

    it('should return 0 for empty URL', () => {
      mockLocation('');
      
      const result = service.getUniqueId('details');
      
      expect(result).toBe(0);
    });

    it('should return 0 for empty lastWord parameter', () => {
      mockLocation('http://example.com/some/path/details/123');
      
      const result = service.getUniqueId('');
      
      expect(result).toBe(0);
    });

    it('should handle complex URL with custom lastWord and numeric id', () => {
      mockLocation('http://example.com/app/module/submodule/product/666');
      
      const result = service.getUniqueId('product');
      
      expect(result).toBe(666);
    });

    it('should be case sensitive for lastWord matching', () => {
      mockLocation('http://example.com/some/path/Details/123');
      
      const result = service.getUniqueId('details');
      
      expect(result).toBe(0);
    });

    it('should handle special characters in lastWord', () => {
      mockLocation('http://example.com/some/path/item-details/555');
      
      const result = service.getUniqueId('item-details');
      
      expect(result).toBe(555);
    });

    it('should return 0 when lastWord is followed by non-numeric value', () => {
      mockLocation('http://example.com/some/path/details/non-numeric');
      
      const result = service.getUniqueId('details');
      
      expect(result).toBe(0);
    });
  });
});