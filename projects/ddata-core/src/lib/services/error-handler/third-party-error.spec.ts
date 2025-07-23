import { TestBed } from '@angular/core/testing';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';
import { ThirdPartyError } from './third-party-error';
import { DdataCoreError } from './ddata-core-error';

describe('ThirdPartyError', () => {
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    // Create a spy object for NotificationService
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    });

    // Spy on console.error
    consoleErrorSpy = spyOn(console, 'error');
  });

  afterEach(() => {
    // Clean up console spy after each test
    consoleErrorSpy.calls.reset();
  });

  describe('constructor', () => {
    it('should create an instance', () => {
      const originalError = { error: 'Test error message' };
      const error = new ThirdPartyError(originalError, mockNotificationService);

      expect(error).toBeTruthy();
      expect(error instanceof ThirdPartyError).toBe(true);
      expect(error instanceof DdataCoreError).toBe(true);
    });

    it('should call super constructor with originalError', () => {
      const originalError = { error: 'Test error message' };
      const error = new ThirdPartyError(originalError, mockNotificationService);

      // Check that the parent class properties are set
      expect(error.originalError).toBe(originalError);
    });

    it('should log error message to console', () => {
      const originalError = { error: 'Test error message' };
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('580 - API message: ', 'Test error message');
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('should call notification service add method with correct parameters', () => {
      const originalError = { error: 'Test error message' };
      new ThirdPartyError(originalError, mockNotificationService);

      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Test error message',
        'danger' as NotificationType
      );
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('originalError variations', () => {
    it('should handle originalError with string error property', () => {
      const originalError = { error: 'Simple string error' };
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('580 - API message: ', 'Simple string error');
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Simple string error',
        'danger' as NotificationType
      );
    });

    it('should handle originalError with object error property', () => {
      const errorObject = { message: 'Complex error', code: 500 };
      const originalError = { error: errorObject };
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('580 - API message: ', errorObject);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        errorObject,
        'danger' as NotificationType
      );
    });

    it('should handle originalError with number error property', () => {
      const originalError = { error: 404 };
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('580 - API message: ', 404);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        404,
        'danger' as NotificationType
      );
    });

    it('should handle originalError with boolean error property', () => {
      const originalError = { error: false };
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('580 - API message: ', false);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        false,
        'danger' as NotificationType
      );
    });

    it('should handle originalError with null error property', () => {
      const originalError = { error: null };
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('580 - API message: ', null);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        null,
        'danger' as NotificationType
      );
    });

    it('should handle originalError with undefined error property', () => {
      const originalError = { error: undefined };
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('580 - API message: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        undefined,
        'danger' as NotificationType
      );
    });

    it('should handle originalError without error property', () => {
      const originalError = { message: 'No error property' };
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('580 - API message: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        undefined,
        'danger' as NotificationType
      );
    });

    it('should handle empty originalError object', () => {
      const originalError = {};
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('580 - API message: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        undefined,
        'danger' as NotificationType
      );
    });

    it('should handle null originalError', () => {
      const originalError = null;
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('580 - API message: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        undefined,
        'danger' as NotificationType
      );
    });

    it('should handle undefined originalError', () => {
      const originalError = undefined;
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('580 - API message: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        undefined,
        'danger' as NotificationType
      );
    });
  });

  describe('edge cases', () => {
    it('should handle complex nested error structures', () => {
      const originalError = {
        error: {
          details: {
            message: 'Nested error message',
            stack: 'Error stack trace'
          },
          code: 'COMPLEX_ERROR'
        }
      };
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('580 - API message: ', originalError.error);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        originalError.error,
        'danger' as NotificationType
      );
    });

    it('should handle originalError with array error property', () => {
      const errorArray = ['Error 1', 'Error 2', 'Error 3'];
      const originalError = { error: errorArray };
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('580 - API message: ', errorArray);
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        errorArray,
        'danger' as NotificationType
      );
    });

    it('should handle originalError with empty string error', () => {
      const originalError = { error: '' };
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('580 - API message: ', '');
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        '',
        'danger' as NotificationType
      );
    });

    it('should handle originalError with whitespace-only error', () => {
      const originalError = { error: '   \n\t  ' };
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('580 - API message: ', '   \n\t  ');
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        '   \n\t  ',
        'danger' as NotificationType
      );
    });
  });

  describe('inheritance from DdataCoreError', () => {
    it('should properly inherit from DdataCoreError', () => {
      const originalError = { 
        error: {
          trace: [
            { file: 'app/Http/Controllers/TestController.php', line: 123 },
            { file: 'vendor/package/file.php', line: 456 }
          ]
        }
      };
      const error = new ThirdPartyError(originalError, mockNotificationService);

      // Check that parent class msg property is set correctly
      expect(error.msg).toContain('app/Http/Controllers/TestController.php:123');
      expect(error.originalError).toBe(originalError);
    });

    it('should handle originalError without trace in parent class', () => {
      const originalError = { error: 'Simple error without trace' };
      const error = new ThirdPartyError(originalError, mockNotificationService);

      // Parent class should handle this gracefully
      expect(error.msg).toBe('');
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('notification type constant', () => {
    it('should always use danger notification type', () => {
      const originalError = { error: 'Any error' };
      new ThirdPartyError(originalError, mockNotificationService);

      const addCall = mockNotificationService.add.calls.mostRecent();
      expect(addCall.args[2]).toBe('danger' as NotificationType);
    });

    it('should always use "Hiba" as notification title', () => {
      const originalError = { error: 'Any error' };
      new ThirdPartyError(originalError, mockNotificationService);

      const addCall = mockNotificationService.add.calls.mostRecent();
      expect(addCall.args[0]).toBe('Hiba');
    });
  });

  describe('console logging specifics', () => {
    it('should log with specific prefix "580 - API message: "', () => {
      const originalError = { error: 'Test message' };
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('580 - API message: ', 'Test message');
      
      const call = consoleErrorSpy.calls.mostRecent();
      expect(call.args[0]).toBe('580 - API message: ');
      expect(call.args[1]).toBe('Test message');
    });

    it('should call console.error exactly once per instantiation', () => {
      const originalError = { error: 'Test message' };
      new ThirdPartyError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });
});