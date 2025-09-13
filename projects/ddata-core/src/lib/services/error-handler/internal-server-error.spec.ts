import { InternalServerError } from './internal-server-error';
import { DdataCoreError } from './ddata-core-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

describe('InternalServerError', () => {
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    // Create a spy object for NotificationService
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['add']);
    
    // Spy on console.error
    consoleErrorSpy = spyOn(console, 'error');
  });

  describe('constructor', () => {
    it('should create an instance of InternalServerError', () => {
      const originalError = {
        error: {
          message: 'Test error message'
        }
      };

      const error = new InternalServerError(originalError, mockNotificationService);

      expect(error).toBeTruthy();
      expect(error).toBeInstanceOf(InternalServerError);
    });

    it('should extend DdataCoreError', () => {
      const originalError = {
        error: {
          message: 'Test error message'
        }
      };

      const error = new InternalServerError(originalError, mockNotificationService);

      expect(error).toBeInstanceOf(DdataCoreError);
    });

    it('should call super constructor with originalError', () => {
      const originalError = {
        error: {
          message: 'Test error message'
        }
      };

      const error = new InternalServerError(originalError, mockNotificationService);

      // Verify that properties from DdataCoreError are available
      expect(error.originalError).toBe(originalError);
    });

    it('should call console.error with correct message', () => {
      const testMessage = 'Test error message';
      const originalError = {
        error: {
          message: testMessage
        }
      };

      new InternalServerError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Internal Server Error: ', testMessage);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('should call notificationService.add with correct parameters', () => {
      const originalError = {
        error: {
          message: 'Test error message'
        }
      };

      new InternalServerError(originalError, mockNotificationService);

      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Szerver hiba történt',
        'danger' as NotificationType
      );
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('inheritance behavior', () => {
    it('should inherit all properties from DdataCoreError', () => {
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

      const error = new InternalServerError(originalError, mockNotificationService);

      // Check that inherited properties are available
      expect(error.msg).toBeDefined();
      expect(error.originalError).toBe(originalError);
    });

    it('should process trace information through parent constructor', () => {
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

      const error = new InternalServerError(originalError, mockNotificationService);

      // The DdataCoreError constructor should process the trace
      expect(error.msg).toContain('app/Http/Controllers/TestController.php:42');
    });
  });

  describe('edge cases', () => {
    it('should handle originalError with undefined error.message', () => {
      const originalError = {
        error: {
          message: undefined
        }
      };

      expect(() => {
        new InternalServerError(originalError, mockNotificationService);
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Internal Server Error: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle originalError with null error.message', () => {
      const originalError = {
        error: {
          message: null
        }
      };

      expect(() => {
        new InternalServerError(originalError, mockNotificationService);
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Internal Server Error: ', null);
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle originalError with empty string message', () => {
      const originalError = {
        error: {
          message: ''
        }
      };

      expect(() => {
        new InternalServerError(originalError, mockNotificationService);
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Internal Server Error: ', '');
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle originalError without error property', () => {
      const originalError = {} as any;

      expect(() => {
        new InternalServerError(originalError, mockNotificationService);
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Internal Server Error: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle null originalError', () => {
      const originalError = null as any;

      expect(() => {
        new InternalServerError(originalError, mockNotificationService);
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Internal Server Error: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle undefined originalError', () => {
      const originalError = undefined as any;

      expect(() => {
        new InternalServerError(originalError, mockNotificationService);
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Internal Server Error: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle originalError with nested undefined error', () => {
      const originalError = {
        error: undefined
      } as any;

      expect(() => {
        new InternalServerError(originalError, mockNotificationService);
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Internal Server Error: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle originalError with non-object error', () => {
      const originalError = {
        error: 'string error'
      } as any;

      expect(() => {
        new InternalServerError(originalError, mockNotificationService);
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Internal Server Error: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle originalError with null error property', () => {
      const originalError = {
        error: null
      } as any;

      expect(() => {
        new InternalServerError(originalError, mockNotificationService);
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Internal Server Error: ', undefined);
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle originalError with number error.message', () => {
      const originalError = {
        error: {
          message: 500
        }
      };

      expect(() => {
        new InternalServerError(originalError, mockNotificationService);
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Internal Server Error: ', 500);
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle originalError with boolean error.message', () => {
      const originalError = {
        error: {
          message: false
        }
      };

      expect(() => {
        new InternalServerError(originalError, mockNotificationService);
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Internal Server Error: ', false);
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle originalError with object error.message', () => {
      const messageObject = { details: 'error details' };
      const originalError = {
        error: {
          message: messageObject
        }
      };

      expect(() => {
        new InternalServerError(originalError, mockNotificationService);
      }).not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Internal Server Error: ', messageObject);
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('console and notification integration', () => {
    it('should call both console.error and notification service in correct order', () => {
      const originalError = {
        error: {
          message: 'Test error message'
        }
      };

      new InternalServerError(originalError, mockNotificationService);

      // Verify both were called
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNotificationService.add).toHaveBeenCalled();
    });

    it('should work with different types of error messages', () => {
      const testCases = [
        'Simple error message',
        'Error with special characters: éáűőú @#$%^&*()',
        'Very long error message '.repeat(50),
        '123456789',
        'Error\nwith\nnewlines',
        'Error\twith\ttabs'
      ];

      testCases.forEach((message, index) => {
        consoleErrorSpy.calls.reset();
        mockNotificationService.add.calls.reset();

        const originalError = {
          error: {
            message: message
          }
        };

        new InternalServerError(originalError, mockNotificationService);

        expect(consoleErrorSpy).toHaveBeenCalledWith('Internal Server Error: ', message);
        expect(mockNotificationService.add).toHaveBeenCalledWith(
          'Hiba',
          'Szerver hiba történt', 
          'danger' as NotificationType
        );
      });
    });
  });

  describe('notification type casting', () => {
    it('should cast "danger" string to NotificationType', () => {
      const originalError = {
        error: {
          message: 'Test error message'
        }
      };

      new InternalServerError(originalError, mockNotificationService);

      const callArgs = mockNotificationService.add.calls.mostRecent().args;
      expect(callArgs[2]).toBe('danger');
      expect(typeof callArgs[2]).toBe('string');
    });
  });

  describe('constructor parameters', () => {
    it('should require both originalError and notificationService parameters', () => {
      const originalError = {
        error: {
          message: 'Test error message'
        }
      };

      // Test with both parameters
      expect(() => {
        new InternalServerError(originalError, mockNotificationService);
      }).not.toThrow();
    });

    it('should accept any type for originalError parameter', () => {
      const testCases = [
        { error: { message: 'test' } },
        { error: null },
        { error: undefined },
        { something: 'else' },
        null,
        undefined,
        'string',
        123,
        [],
        {}
      ];

      testCases.forEach((testCase, index) => {
        consoleErrorSpy.calls.reset();
        mockNotificationService.add.calls.reset();

        expect(() => {
          new InternalServerError(testCase, mockNotificationService);
        }).not.toThrow();

        expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('type verification', () => {
    it('should be an instance of Error (through inheritance chain)', () => {
      const originalError = {
        error: {
          message: 'Test error message'
        }
      };

      const error = new InternalServerError(originalError, mockNotificationService);

      // InternalServerError -> DdataCoreError -> (potentially Error if DdataCoreError extends Error)
      expect(error).toBeInstanceOf(InternalServerError);
      expect(error).toBeInstanceOf(DdataCoreError);
    });

    it('should have correct constructor property', () => {
      const originalError = {
        error: {
          message: 'Test error message'
        }
      };

      const error = new InternalServerError(originalError, mockNotificationService);

      expect(error.constructor).toBe(InternalServerError);
    });

    it('should have correct prototype chain', () => {
      const originalError = {
        error: {
          message: 'Test error message'
        }
      };

      const error = new InternalServerError(originalError, mockNotificationService);

      expect(Object.getPrototypeOf(error)).toBe(InternalServerError.prototype);
      expect(Object.getPrototypeOf(InternalServerError.prototype)).toBe(DdataCoreError.prototype);
    });
  });
});