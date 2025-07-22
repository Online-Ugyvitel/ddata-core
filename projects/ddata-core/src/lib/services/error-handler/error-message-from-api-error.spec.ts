import { TestBed } from '@angular/core/testing';
import { ErrorMessageFromApi } from './error-message-from-api-error';
import { DdataCoreError } from './ddata-core-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

describe('ErrorMessageFromApi', () => {
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    // Create a spy object for NotificationService
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['add']);
    
    // Spy on console.error
    consoleErrorSpy = spyOn(console, 'error');

    TestBed.configureTestingModule({
      providers: [
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    });
  });

  afterEach(() => {
    // Clean up spies
    consoleErrorSpy.and.stub();
  });

  describe('Constructor', () => {
    it('should create an instance', () => {
      const originalError = { error: 'Test error message' };
      const errorInstance = new ErrorMessageFromApi(originalError, mockNotificationService);
      
      expect(errorInstance).toBeTruthy();
      expect(errorInstance instanceof ErrorMessageFromApi).toBe(true);
      expect(errorInstance instanceof DdataCoreError).toBe(true);
    });

    it('should call super constructor with originalError', () => {
      const originalError = { 
        error: 'Test error message',
        status: 430
      };
      
      const errorInstance = new ErrorMessageFromApi(originalError, mockNotificationService);
      
      expect(errorInstance.originalError).toBe(originalError);
    });

    it('should log error to console with correct format', () => {
      const originalError = { error: 'API error message' };
      
      new ErrorMessageFromApi(originalError, mockNotificationService);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('430 - Api message: ', originalError.error);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('should call NotificationService.add with correct parameters', () => {
      const originalError = { error: 'API error message' };
      
      new ErrorMessageFromApi(originalError, mockNotificationService);
      
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba', 
        originalError.error, 
        'danger' as NotificationType
      );
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('Different originalError structures', () => {
    it('should handle originalError with null error property', () => {
      const originalError = { error: null };
      
      new ErrorMessageFromApi(originalError, mockNotificationService);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('430 - Api message: ', null);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba', 
        null, 
        'danger' as NotificationType
      );
    });

    it('should handle originalError with undefined error property', () => {
      const originalError = { error: undefined };
      
      new ErrorMessageFromApi(originalError, mockNotificationService);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('430 - Api message: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba', 
        undefined, 
        'danger' as NotificationType
      );
    });

    it('should handle originalError with empty string error property', () => {
      const originalError = { error: '' };
      
      new ErrorMessageFromApi(originalError, mockNotificationService);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('430 - Api message: ', '');
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba', 
        '', 
        'danger' as NotificationType
      );
    });

    it('should handle originalError with number error property', () => {
      const originalError = { error: 404 };
      
      new ErrorMessageFromApi(originalError, mockNotificationService);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('430 - Api message: ', 404);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba', 
        404, 
        'danger' as NotificationType
      );
    });

    it('should handle originalError with object error property', () => {
      const errorObject = { message: 'Detailed error', code: 500 };
      const originalError = { error: errorObject };
      
      new ErrorMessageFromApi(originalError, mockNotificationService);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('430 - Api message: ', errorObject);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba', 
        errorObject, 
        'danger' as NotificationType
      );
    });

    it('should handle originalError without error property', () => {
      const originalError = { status: 430, message: 'Something went wrong' };
      
      new ErrorMessageFromApi(originalError, mockNotificationService);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('430 - Api message: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba', 
        undefined, 
        'danger' as NotificationType
      );
    });

    it('should handle null originalError', () => {
      const originalError = null;
      
      expect(() => new ErrorMessageFromApi(originalError, mockNotificationService)).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith('430 - Api message: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba', 
        undefined, 
        'danger' as NotificationType
      );
    });

    it('should handle undefined originalError', () => {
      const originalError = undefined;
      
      expect(() => new ErrorMessageFromApi(originalError, mockNotificationService)).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith('430 - Api message: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba', 
        undefined, 
        'danger' as NotificationType
      );
    });
  });

  describe('Integration with DdataCoreError', () => {
    it('should inherit properties from DdataCoreError', () => {
      const originalError = { 
        error: 'Test error',
        trace: [
          { file: 'app/Http/Controllers/TestController.php', line: 42 }
        ]
      };
      
      const errorInstance = new ErrorMessageFromApi(originalError, mockNotificationService);
      
      expect(errorInstance.msg).toBeDefined();
      expect(errorInstance.originalError).toBe(originalError);
    });

    it('should process trace information via DdataCoreError constructor', () => {
      const originalError = { 
        error: {
          trace: [
            { file: 'app/Http/Controllers/UserController.php', line: 123 },
            { file: 'other/file.php', line: 456 }
          ]
        }
      };
      
      const errorInstance = new ErrorMessageFromApi(originalError, mockNotificationService);
      
      // Verify that the super constructor was called and processed the trace
      expect(errorInstance.msg).toContain('app/Http/Controllers/UserController.php:123');
    });
  });

  describe('Type checking', () => {
    it('should have correct type for NotificationType parameter', () => {
      const originalError = { error: 'Test error' };
      
      new ErrorMessageFromApi(originalError, mockNotificationService);
      
      const callArgs = mockNotificationService.add.calls.argsFor(0);
      expect(callArgs[2]).toBe('danger' as NotificationType);
    });
  });

  describe('Error scenarios', () => {
    it('should handle NotificationService throwing error', () => {
      const originalError = { error: 'Test error' };
      mockNotificationService.add.and.throwError('Notification service error');
      
      expect(() => new ErrorMessageFromApi(originalError, mockNotificationService)).toThrowError('Notification service error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('430 - Api message: ', originalError.error);
    });

    it('should handle console.error being overridden', () => {
      const originalError = { error: 'Test error' };
      
      // Override console.error temporarily
      const originalConsoleError = console.error;
      console.error = jasmine.createSpy('overridden-console-error');
      
      new ErrorMessageFromApi(originalError, mockNotificationService);
      
      expect(console.error).toHaveBeenCalledWith('430 - Api message: ', originalError.error);
      
      // Restore original console.error
      console.error = originalConsoleError;
    });
  });
});