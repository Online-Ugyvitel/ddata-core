import { NotFoundError } from './not-found-error';
import { DdataCoreError } from './ddata-core-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

describe('NotFoundError', () => {
  let notificationService: jasmine.SpyObj<NotificationService>;
  let consoleErrorSpy: jasmine.Spy;
  let notFoundError: NotFoundError;

  beforeEach(() => {
    // Create a spy object for NotificationService
    notificationService = jasmine.createSpyObj('NotificationService', ['add']);
    
    // Spy on console.error
    consoleErrorSpy = spyOn(console, 'error');
  });

  describe('constructor', () => {
    it('should create an instance and extend DdataCoreError', () => {
      const originalError = {
        error: {
          message: 'Test error message'
        }
      };

      notFoundError = new NotFoundError(originalError, notificationService);

      expect(notFoundError).toBeTruthy();
      expect(notFoundError instanceof NotFoundError).toBe(true);
      expect(notFoundError instanceof DdataCoreError).toBe(true);
    });

    it('should call super constructor with originalError', () => {
      const originalError = {
        error: {
          message: 'Test error message',
          trace: [
            {
              file: 'app/Http/Controllers/TestController.php',
              line: 42
            }
          ]
        }
      };

      notFoundError = new NotFoundError(originalError, notificationService);

      // Check that the parent class properties are set correctly
      expect(notFoundError.originalError).toBe(originalError);
      expect(notFoundError.msg).toContain('app/Http/Controllers/TestController.php:42');
    });

    it('should call console.error with originalError.error.message', () => {
      const testMessage = 'Test not found error message';
      const originalError = {
        error: {
          message: testMessage
        }
      };

      notFoundError = new NotFoundError(originalError, notificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Not Found Error: ', testMessage);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('should call notificationService.add with correct parameters', () => {
      const originalError = {
        error: {
          message: 'Test error message'
        }
      };

      notFoundError = new NotFoundError(originalError, notificationService);

      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'A keresett oldal nem található.',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('error scenarios', () => {
    it('should handle originalError with undefined error.message', () => {
      const originalError = {
        error: {
          message: undefined
        }
      };

      notFoundError = new NotFoundError(originalError, notificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Not Found Error: ', undefined);
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'A keresett oldal nem található.',
        'danger' as NotificationType
      );
    });

    it('should handle originalError with null error.message', () => {
      const originalError = {
        error: {
          message: null
        }
      };

      notFoundError = new NotFoundError(originalError, notificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Not Found Error: ', null);
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'A keresett oldal nem található.',
        'danger' as NotificationType
      );
    });

    it('should handle originalError with empty string message', () => {
      const originalError = {
        error: {
          message: ''
        }
      };

      notFoundError = new NotFoundError(originalError, notificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Not Found Error: ', '');
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'A keresett oldal nem található.',
        'danger' as NotificationType
      );
    });

    it('should handle originalError with numeric message', () => {
      const originalError = {
        error: {
          message: 404
        }
      };

      notFoundError = new NotFoundError(originalError, notificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Not Found Error: ', 404);
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'A keresett oldal nem található.',
        'danger' as NotificationType
      );
    });

    it('should handle originalError with boolean message', () => {
      const originalError = {
        error: {
          message: false
        }
      };

      notFoundError = new NotFoundError(originalError, notificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Not Found Error: ', false);
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'A keresett oldal nem található.',
        'danger' as NotificationType
      );
    });

    it('should handle originalError without error property', () => {
      const originalError = {};

      expect(() => {
        notFoundError = new NotFoundError(originalError, notificationService);
      }).toThrow();
    });

    it('should handle null originalError', () => {
      expect(() => {
        notFoundError = new NotFoundError(null, notificationService);
      }).toThrow();
    });

    it('should handle undefined originalError', () => {
      expect(() => {
        notFoundError = new NotFoundError(undefined, notificationService);
      }).toThrow();
    });
  });

  describe('inheritance behavior', () => {
    it('should inherit all properties from DdataCoreError', () => {
      const originalError = {
        error: {
          message: 'Test message'
        }
      };

      notFoundError = new NotFoundError(originalError, notificationService);

      // Check that inherited properties exist
      expect(notFoundError.msg).toBeDefined();
      expect(notFoundError.originalError).toBeDefined();
      expect(typeof notFoundError.msg).toBe('string');
    });

    it('should properly handle trace information in parent constructor', () => {
      const originalError = {
        error: {
          message: 'Test message',
          trace: [
            {
              file: 'app/Http/Controllers/UserController.php',
              line: 123
            },
            {
              file: 'vendor/laravel/framework/src/Illuminate/Routing/Controller.php',
              line: 54
            },
            {
              file: 'app/Http/Controllers/AdminController.php',
              line: 89
            }
          ]
        }
      };

      notFoundError = new NotFoundError(originalError, notificationService);

      // Should contain controller file paths and lines
      expect(notFoundError.msg).toContain('app/Http/Controllers/UserController.php:123');
      expect(notFoundError.msg).toContain('app/Http/Controllers/AdminController.php:89');
      // Should not contain non-controller files
      expect(notFoundError.msg).not.toContain('vendor/laravel/framework');
    });

    it('should handle trace without file or line properties', () => {
      const originalError = {
        error: {
          message: 'Test message',
          trace: [
            {
              file: 'app/Http/Controllers/TestController.php'
              // missing line property
            },
            {
              line: 42
              // missing file property
            },
            {
              // missing both file and line
            }
          ]
        }
      };

      notFoundError = new NotFoundError(originalError, notificationService);

      // Should not throw and should handle missing properties gracefully
      expect(notFoundError).toBeTruthy();
      expect(notFoundError.msg).toBe('');
    });
  });

  describe('all code paths', () => {
    it('should execute all constructor code paths', () => {
      const originalError = {
        error: {
          message: 'Complete test message'
        }
      };

      notFoundError = new NotFoundError(originalError, notificationService);

      // Verify all expected calls were made
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(notificationService.add).toHaveBeenCalled();
      expect(notFoundError instanceof DdataCoreError).toBe(true);
      expect(notFoundError instanceof NotFoundError).toBe(true);
    });

    it('should maintain proper method call order', () => {
      const originalError = {
        error: {
          message: 'Order test message'
        }
      };

      // Reset call counts
      consoleErrorSpy.calls.reset();
      notificationService.add.calls.reset();

      notFoundError = new NotFoundError(originalError, notificationService);

      // Both methods should have been called exactly once
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('type safety', () => {
    it('should properly type the NotificationType parameter', () => {
      const originalError = {
        error: {
          message: 'Type test message'
        }
      };

      notFoundError = new NotFoundError(originalError, notificationService);

      // Get the actual call arguments
      const addCallArgs = notificationService.add.calls.mostRecent().args;
      
      expect(addCallArgs[0]).toBe('Hiba');
      expect(addCallArgs[1]).toBe('A keresett oldal nem található.');
      expect(addCallArgs[2]).toBe('danger');
      expect(typeof addCallArgs[2]).toBe('string');
    });
  });

  describe('complete coverage verification', () => {
    it('should execute all lines of code in constructor', () => {
      const testMessage = 'Coverage verification message';
      const originalError = {
        error: {
          message: testMessage
        }
      };

      // Reset spies to ensure clean state
      consoleErrorSpy.calls.reset();
      notificationService.add.calls.reset();

      // Create instance - this should execute every line in the constructor
      notFoundError = new NotFoundError(originalError, notificationService);

      // Verify every line was executed:
      // 1. Class instantiation
      expect(notFoundError).toBeTruthy();
      
      // 2. super(originalError) call - verified by checking inherited properties
      expect(notFoundError.originalError).toBe(originalError);
      
      // 3. console.error call with exact parameters
      expect(consoleErrorSpy).toHaveBeenCalledWith('Not Found Error: ', testMessage);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      
      // 4. notificationService.add call with exact parameters
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba', 
        'A keresett oldal nem található.', 
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle complex originalError structure correctly', () => {
      const complexMessage = 'Complex error message with special chars: áéíóúüőű';
      const originalError = {
        error: {
          message: complexMessage,
          code: 404,
          details: 'Additional error details',
          timestamp: new Date().toISOString()
        },
        status: 404,
        statusText: 'Not Found'
      };

      notFoundError = new NotFoundError(originalError, notificationService);

      // Should correctly extract only the message part
      expect(consoleErrorSpy).toHaveBeenCalledWith('Not Found Error: ', complexMessage);
      
      // Should still call notification service with fixed Hungarian text
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'A keresett oldal nem található.',
        'danger' as NotificationType
      );
    });
  });
});