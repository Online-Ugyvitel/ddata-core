import { Router } from '@angular/router';
import { UnauthorizedError } from './unauthorized-error';
import { StorageService } from '../storage/storage.service';

describe('UnauthorizedError', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockStorageService: jasmine.SpyObj<StorageService>;
  let originalError: any;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    // Create mock objects
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], {
      url: '/some-page'
    });
    mockStorageService = jasmine.createSpyObj('StorageService', ['clear']);
    
    // Mock console.error
    consoleErrorSpy = spyOn(console, 'error');
    
    // Mock document.getElementById
    spyOn(document, 'getElementById').and.returnValue(null);
    
    // Sample original error
    originalError = {
      message: 'Unauthorized',
      status: 401
    };
  });

  describe('1. Error Creation', () => {
    it('should create the error instance', () => {
      const error = new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      expect(error).toBeTruthy();
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(UnauthorizedError);
    });

    it('should extend DdataCoreError', () => {
      const error = new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      expect(error.constructor.name).toBe('UnauthorizedError');
      expect(error.originalError).toBe(originalError);
    });

    it('should log error message', () => {
      new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('401 - Unauthorized Error');
    });
  });

  describe('2. Router URL Handling', () => {
    it('should not trigger logout flow when router URL is /login', () => {
      // Set router URL to /login
      Object.defineProperty(mockRouter, 'url', {
        get: () => '/login',
        configurable: true
      });

      new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      expect(mockStorageService.clear).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      expect(document.getElementById).not.toHaveBeenCalled();
    });

    it('should trigger logout flow when router URL is not /login', () => {
      // Set router URL to something other than /login
      Object.defineProperty(mockRouter, 'url', {
        get: () => '/dashboard',
        configurable: true
      });

      new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      expect(mockStorageService.clear).toHaveBeenCalled();
    });
  });

  describe('3. Storage Service Interaction', () => {
    beforeEach(() => {
      // Ensure router URL is not /login to trigger the flow
      Object.defineProperty(mockRouter, 'url', {
        get: () => '/dashboard',
        configurable: true
      });
    });

    it('should clear storage when router URL is not /login', () => {
      new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      expect(mockStorageService.clear).toHaveBeenCalledTimes(1);
    });
  });

  describe('4. DOM Element Interactions - Logout Element', () => {
    let mockLogoutElement: jasmine.SpyObj<HTMLElement>;

    beforeEach(() => {
      // Ensure router URL is not /login to trigger the flow
      Object.defineProperty(mockRouter, 'url', {
        get: () => '/dashboard',
        configurable: true
      });

      mockLogoutElement = jasmine.createSpyObj('HTMLElement', ['click']);
    });

    it('should click logout element when it exists', () => {
      (document.getElementById as jasmine.Spy).and.callFake((id: string) => {
        if (id === 'nav-logout') {
          return mockLogoutElement;
        }
        return null;
      });

      new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      expect(document.getElementById).toHaveBeenCalledWith('nav-logout');
      expect(mockLogoutElement.click).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('5. DOM Element Interactions - Login Element', () => {
    let mockLoginElement: jasmine.SpyObj<HTMLElement>;

    beforeEach(() => {
      // Ensure router URL is not /login to trigger the flow
      Object.defineProperty(mockRouter, 'url', {
        get: () => '/dashboard',
        configurable: true
      });

      mockLoginElement = jasmine.createSpyObj('HTMLElement', ['click']);
    });

    it('should click login element when logout does not exist but login exists', () => {
      (document.getElementById as jasmine.Spy).and.callFake((id: string) => {
        if (id === 'nav-logout') {
          return null; // No logout element
        }
        if (id === 'nav-login') {
          return mockLoginElement; // Login element exists
        }
        return null;
      });

      new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      expect(document.getElementById).toHaveBeenCalledWith('nav-logout');
      expect(document.getElementById).toHaveBeenCalledWith('nav-login');
      expect(mockLoginElement.click).toHaveBeenCalledTimes(1);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('6. DOM Element Interactions - Navigation Fallback', () => {
    beforeEach(() => {
      // Ensure router URL is not /login to trigger the flow
      Object.defineProperty(mockRouter, 'url', {
        get: () => '/dashboard',
        configurable: true
      });
    });

    it('should navigate to /login when neither logout nor login elements exist', () => {
      (document.getElementById as jasmine.Spy).and.returnValue(null);

      new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      expect(document.getElementById).toHaveBeenCalledWith('nav-logout');
      expect(document.getElementById).toHaveBeenCalledWith('nav-login');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('7. Complete Flow Integration Tests', () => {
    it('should execute complete flow for non-login URL with logout element', () => {
      const mockLogoutElement = jasmine.createSpyObj('HTMLElement', ['click']);
      Object.defineProperty(mockRouter, 'url', {
        get: () => '/profile',
        configurable: true
      });
      
      (document.getElementById as jasmine.Spy).and.callFake((id: string) => {
        return id === 'nav-logout' ? mockLogoutElement : null;
      });

      new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      // Verify complete flow
      expect(consoleErrorSpy).toHaveBeenCalledWith('401 - Unauthorized Error');
      expect(mockStorageService.clear).toHaveBeenCalled();
      expect(document.getElementById).toHaveBeenCalledWith('nav-logout');
      expect(mockLogoutElement.click).toHaveBeenCalled();
      expect(document.getElementById).not.toHaveBeenCalledWith('nav-login');
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should execute complete flow for non-login URL with login element only', () => {
      const mockLoginElement = jasmine.createSpyObj('HTMLElement', ['click']);
      Object.defineProperty(mockRouter, 'url', {
        get: () => '/settings',
        configurable: true
      });
      
      (document.getElementById as jasmine.Spy).and.callFake((id: string) => {
        return id === 'nav-login' ? mockLoginElement : null;
      });

      new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      // Verify complete flow
      expect(consoleErrorSpy).toHaveBeenCalledWith('401 - Unauthorized Error');
      expect(mockStorageService.clear).toHaveBeenCalled();
      expect(document.getElementById).toHaveBeenCalledWith('nav-logout');
      expect(document.getElementById).toHaveBeenCalledWith('nav-login');
      expect(mockLoginElement.click).toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('should execute complete flow for non-login URL with no navigation elements', () => {
      Object.defineProperty(mockRouter, 'url', {
        get: () => '/admin',
        configurable: true
      });
      
      (document.getElementById as jasmine.Spy).and.returnValue(null);

      new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      // Verify complete flow
      expect(consoleErrorSpy).toHaveBeenCalledWith('401 - Unauthorized Error');
      expect(mockStorageService.clear).toHaveBeenCalled();
      expect(document.getElementById).toHaveBeenCalledWith('nav-logout');
      expect(document.getElementById).toHaveBeenCalledWith('nav-login');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle login URL correctly without any side effects', () => {
      Object.defineProperty(mockRouter, 'url', {
        get: () => '/login',
        configurable: true
      });

      new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      // Verify minimal flow for login URL
      expect(consoleErrorSpy).toHaveBeenCalledWith('401 - Unauthorized Error');
      expect(mockStorageService.clear).not.toHaveBeenCalled();
      expect(document.getElementById).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('8. Error Object Handling', () => {
    beforeEach(() => {
      Object.defineProperty(mockRouter, 'url', {
        get: () => '/test',
        configurable: true
      });
    });

    it('should handle undefined originalError', () => {
      expect(() => {
        new UnauthorizedError(mockRouter, undefined, mockStorageService);
      }).not.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('401 - Unauthorized Error');
    });

    it('should handle null originalError', () => {
      expect(() => {
        new UnauthorizedError(mockRouter, null, mockStorageService);
      }).not.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('401 - Unauthorized Error');
    });

    it('should handle complex originalError object', () => {
      const complexError = {
        message: 'Access denied',
        status: 401,
        error: {
          trace: [
            { file: 'app/Http/Controllers/AuthController.php', line: 42 }
          ]
        }
      };

      const error = new UnauthorizedError(mockRouter, complexError, mockStorageService);
      
      expect(error.originalError).toBe(complexError);
      expect(consoleErrorSpy).toHaveBeenCalledWith('401 - Unauthorized Error');
    });
  });

  describe('9. Edge Cases', () => {
    it('should handle exact /login URL match', () => {
      Object.defineProperty(mockRouter, 'url', {
        get: () => '/login',
        configurable: true
      });

      new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      expect(mockStorageService.clear).not.toHaveBeenCalled();
    });

    it('should handle /login with query parameters', () => {
      Object.defineProperty(mockRouter, 'url', {
        get: () => '/login?returnUrl=/dashboard',
        configurable: true
      });

      new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      // Should trigger logout flow because URL is not exactly '/login'
      expect(mockStorageService.clear).toHaveBeenCalled();
    });

    it('should handle /login with hash fragment', () => {
      Object.defineProperty(mockRouter, 'url', {
        get: () => '/login#section1',
        configurable: true
      });

      new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      // Should trigger logout flow because URL is not exactly '/login'
      expect(mockStorageService.clear).toHaveBeenCalled();
    });

    it('should handle empty router URL', () => {
      Object.defineProperty(mockRouter, 'url', {
        get: () => '',
        configurable: true
      });

      new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      expect(mockStorageService.clear).toHaveBeenCalled();
    });

    it('should handle root URL', () => {
      Object.defineProperty(mockRouter, 'url', {
        get: () => '/',
        configurable: true
      });

      new UnauthorizedError(mockRouter, originalError, mockStorageService);
      
      expect(mockStorageService.clear).toHaveBeenCalled();
    });
  });

  describe('10. DOM Element Type Safety', () => {
    beforeEach(() => {
      Object.defineProperty(mockRouter, 'url', {
        get: () => '/dashboard',
        configurable: true
      });
    });

    it('should handle non-HTMLElement return from getElementById', () => {
      // Mock getElementById to return a non-HTMLElement that doesn't have click method
      const fakeElement = { notAClickMethod: () => {} };
      (document.getElementById as jasmine.Spy).and.returnValue(fakeElement as any);

      expect(() => {
        new UnauthorizedError(mockRouter, originalError, mockStorageService);
      }).not.toThrow();
      
      // Should fall back to router navigation since elements don't have click method
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});