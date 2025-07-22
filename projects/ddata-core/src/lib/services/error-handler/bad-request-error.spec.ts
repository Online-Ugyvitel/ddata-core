import { BadRequest } from './bad-request-error';
import { DdataCoreError } from './ddata-core-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

describe('BadRequest', () => {
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['add']);
    consoleErrorSpy = spyOn(console, 'error');
  });

  describe('Constructor', () => {
    it('should create an instance', () => {
      const originalError = { error: { message: 'Test error' } };
      const badRequest = new BadRequest(originalError, mockNotificationService);
      
      expect(badRequest).toBeTruthy();
      expect(badRequest).toBeInstanceOf(BadRequest);
    });

    it('should extend DdataCoreError', () => {
      const originalError = { error: { message: 'Test error' } };
      const badRequest = new BadRequest(originalError, mockNotificationService);
      
      expect(badRequest).toBeInstanceOf(DdataCoreError);
    });

    it('should call super constructor with originalError', () => {
      const originalError = { error: { message: 'Test error' } };
      const badRequest = new BadRequest(originalError, mockNotificationService);
      
      expect(badRequest.originalError).toBe(originalError);
    });
  });

  describe('Console Error Logging', () => {
    it('should log error message to console with proper format', () => {
      const originalError = { error: { message: 'Test error message' } };
      new BadRequest(originalError, mockNotificationService);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Bad Request Error: ', 'Test error message');
    });

    it('should log error message to console when error.message exists', () => {
      const originalError = { error: { message: 'Custom error' } };
      new BadRequest(originalError, mockNotificationService);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Bad Request Error: ', 'Custom error');
    });

    it('should handle undefined error.message', () => {
      const originalError = { error: { message: undefined } };
      new BadRequest(originalError, mockNotificationService);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Bad Request Error: ', undefined);
    });

    it('should handle null error.message', () => {
      const originalError = { error: { message: null } };
      new BadRequest(originalError, mockNotificationService);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Bad Request Error: ', null);
    });

    it('should handle empty string error.message', () => {
      const originalError = { error: { message: '' } };
      new BadRequest(originalError, mockNotificationService);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Bad Request Error: ', '');
    });
  });

  describe('Notification Service Integration', () => {
    it('should call notificationService.add with correct parameters', () => {
      const originalError = { error: { message: 'Test error' } };
      new BadRequest(originalError, mockNotificationService);
      
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Valami hiba történt a szerveren!<br>Kérlek próbáld meg később',
        'danger' as NotificationType
      );
    });

    it('should call notificationService.add exactly once', () => {
      const originalError = { error: { message: 'Test error' } };
      new BadRequest(originalError, mockNotificationService);
      
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should call notificationService.add with Hungarian error message', () => {
      const originalError = { error: { message: 'Test error' } };
      new BadRequest(originalError, mockNotificationService);
      
      const [title, message, type] = mockNotificationService.add.calls.argsFor(0);
      expect(title).toBe('Hiba');
      expect(message).toBe('Valami hiba történt a szerveren!<br>Kérlek próbáld meg később');
      expect(type).toBe('danger' as NotificationType);
    });
  });

  describe('Edge Cases', () => {
    it('should handle originalError without error property', () => {
      const originalError = { someOtherProperty: 'value' };
      
      expect(() => {
        new BadRequest(originalError, mockNotificationService);
      }).not.toThrow();
      
      expect(mockNotificationService.add).toHaveBeenCalled();
    });

    it('should handle originalError with null error property', () => {
      const originalError = { error: null };
      
      expect(() => {
        new BadRequest(originalError, mockNotificationService);
      }).not.toThrow();
      
      expect(mockNotificationService.add).toHaveBeenCalled();
    });

    it('should handle originalError with undefined error property', () => {
      const originalError = { error: undefined };
      
      expect(() => {
        new BadRequest(originalError, mockNotificationService);
      }).not.toThrow();
      
      expect(mockNotificationService.add).toHaveBeenCalled();
    });

    it('should handle originalError with error property but no message', () => {
      const originalError = { error: { someProperty: 'value' } };
      
      expect(() => {
        new BadRequest(originalError, mockNotificationService);
      }).not.toThrow();
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Bad Request Error: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalled();
    });

    it('should handle null originalError', () => {
      const originalError = null;
      
      expect(() => {
        new BadRequest(originalError, mockNotificationService);
      }).not.toThrow();
      
      expect(mockNotificationService.add).toHaveBeenCalled();
    });

    it('should handle undefined originalError', () => {
      const originalError = undefined;
      
      expect(() => {
        new BadRequest(originalError, mockNotificationService);
      }).not.toThrow();
      
      expect(mockNotificationService.add).toHaveBeenCalled();
    });

    it('should handle empty originalError object', () => {
      const originalError = {};
      
      expect(() => {
        new BadRequest(originalError, mockNotificationService);
      }).not.toThrow();
      
      expect(mockNotificationService.add).toHaveBeenCalled();
    });

    it('should handle originalError with error as string primitive', () => {
      const originalError = { error: 'string error' };
      
      expect(() => {
        new BadRequest(originalError, mockNotificationService);
      }).not.toThrow();
      
      expect(mockNotificationService.add).toHaveBeenCalled();
    });

    it('should handle originalError with error as number primitive', () => {
      const originalError = { error: 123 };
      
      expect(() => {
        new BadRequest(originalError, mockNotificationService);
      }).not.toThrow();
      
      expect(mockNotificationService.add).toHaveBeenCalled();
    });

    it('should handle originalError with error as boolean primitive', () => {
      const originalError = { error: true };
      
      expect(() => {
        new BadRequest(originalError, mockNotificationService);
      }).not.toThrow();
      
      expect(mockNotificationService.add).toHaveBeenCalled();
    });
  });

  describe('Error Inheritance Properties', () => {
    it('should inherit msg property from DdataCoreError', () => {
      const originalError = { error: { message: 'Test error' } };
      const badRequest = new BadRequest(originalError, mockNotificationService);
      
      expect(badRequest.msg).toBeDefined();
      expect(typeof badRequest.msg).toBe('string');
    });

    it('should maintain originalError property from DdataCoreError', () => {
      const originalError = { error: { message: 'Test error' } };
      const badRequest = new BadRequest(originalError, mockNotificationService);
      
      expect(badRequest.originalError).toBe(originalError);
    });
  });

  describe('Type Verification', () => {
    it('should be an instance of BadRequest', () => {
      const originalError = { error: { message: 'Test error' } };
      const badRequest = new BadRequest(originalError, mockNotificationService);
      
      expect(badRequest).toBeInstanceOf(BadRequest);
    });

    it('should be an instance of DdataCoreError', () => {
      const originalError = { error: { message: 'Test error' } };
      const badRequest = new BadRequest(originalError, mockNotificationService);
      
      expect(badRequest).toBeInstanceOf(DdataCoreError);
    });

    it('should have correct prototype chain', () => {
      const originalError = { error: { message: 'Test error' } };
      const badRequest = new BadRequest(originalError, mockNotificationService);
      
      expect(Object.getPrototypeOf(badRequest)).toBe(BadRequest.prototype);
      expect(Object.getPrototypeOf(Object.getPrototypeOf(badRequest))).toBe(DdataCoreError.prototype);
    });
  });

  describe('Integration with DdataCoreError', () => {
    it('should process originalError through DdataCoreError constructor', () => {
      const originalError = {
        error: {
          message: 'Test error',
          trace: [
            {
              file: 'app/Http/Controllers/TestController.php',
              line: 123
            }
          ]
        }
      };
      
      const badRequest = new BadRequest(originalError, mockNotificationService);
      
      // DdataCoreError should process the trace and set msg
      expect(badRequest.msg).toContain('app/Http/Controllers/TestController.php:123');
    });

    it('should handle originalError without trace in DdataCoreError', () => {
      const originalError = {
        error: {
          message: 'Test error'
          // no trace property
        }
      };
      
      const badRequest = new BadRequest(originalError, mockNotificationService);
      
      expect(badRequest.msg).toBe('');
    });
  });

  describe('Complete Constructor Execution', () => {
    it('should execute all constructor logic in correct order', () => {
      const originalError = { error: { message: 'Test error' } };
      
      const badRequest = new BadRequest(originalError, mockNotificationService);
      
      // Verify super() was called (originalError is set)
      expect(badRequest.originalError).toBe(originalError);
      
      // Verify console.error was called
      expect(consoleErrorSpy).toHaveBeenCalledWith('Bad Request Error: ', 'Test error');
      
      // Verify notificationService.add was called
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Valami hiba történt a szerveren!<br>Kérlek próbáld meg később',
        'danger' as NotificationType
      );
      
      // Verify the instance is created properly
      expect(badRequest).toBeInstanceOf(BadRequest);
      expect(badRequest).toBeInstanceOf(DdataCoreError);
    });
  });
});