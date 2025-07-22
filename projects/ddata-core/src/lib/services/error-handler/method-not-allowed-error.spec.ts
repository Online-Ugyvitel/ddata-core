import { MethodNotAllowedError } from './method-not-allowed-error';
import { DdataCoreError } from './ddata-core-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

describe('MethodNotAllowedError', () => {
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let originalConsoleError: any;

  beforeEach(() => {
    // Create spy object for NotificationService
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['add']);
    
    // Spy on console.error
    originalConsoleError = console.error;
    spyOn(console, 'error');
  });

  afterEach(() => {
    // Restore console.error
    console.error = originalConsoleError;
  });

  describe('Constructor', () => {
    it('should create an instance with valid parameters', () => {
      const originalError = {
        error: {
          message: 'Method not allowed'
        }
      };

      const error = new MethodNotAllowedError(originalError, mockNotificationService);

      expect(error).toBeTruthy();
      expect(error).toBeInstanceOf(MethodNotAllowedError);
    });

    it('should call super constructor with originalError', () => {
      const originalError = {
        error: {
          message: 'Method not allowed'
        }
      };

      const error = new MethodNotAllowedError(originalError, mockNotificationService);

      expect(error.originalError).toBe(originalError);
    });

    it('should call console.error with correct parameters', () => {
      const originalError = {
        error: {
          message: 'Method not allowed'
        }
      };

      new MethodNotAllowedError(originalError, mockNotificationService);

      expect(console.error).toHaveBeenCalledWith('Method Not Allowed Error: ', 'Method not allowed');
    });

    it('should call notificationService.add with correct parameters', () => {
      const originalError = {
        error: {
          message: 'Method not allowed'
        }
      };

      new MethodNotAllowedError(originalError, mockNotificationService);

      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'A funkció nem érhető el.',
        'danger' as NotificationType
      );
    });
  });

  describe('Inheritance', () => {
    it('should extend DdataCoreError', () => {
      const originalError = {
        error: {
          message: 'Method not allowed'
        }
      };

      const error = new MethodNotAllowedError(originalError, mockNotificationService);

      expect(error).toBeInstanceOf(DdataCoreError);
    });

    it('should be an instance of MethodNotAllowedError', () => {
      const originalError = {
        error: {
          message: 'Method not allowed'
        }
      };

      const error = new MethodNotAllowedError(originalError, mockNotificationService);

      expect(error).toBeInstanceOf(MethodNotAllowedError);
    });

    it('should have correct prototype chain', () => {
      const originalError = {
        error: {
          message: 'Method not allowed'
        }
      };

      const error = new MethodNotAllowedError(originalError, mockNotificationService);

      expect(Object.getPrototypeOf(error)).toBe(MethodNotAllowedError.prototype);
    });
  });

  describe('Parameter Handling', () => {
    it('should handle originalError with nested error object', () => {
      const originalError = {
        error: {
          message: 'Custom method not allowed message'
        }
      };

      new MethodNotAllowedError(originalError, mockNotificationService);

      expect(console.error).toHaveBeenCalledWith('Method Not Allowed Error: ', 'Custom method not allowed message');
    });

    it('should handle originalError with empty message', () => {
      const originalError = {
        error: {
          message: ''
        }
      };

      new MethodNotAllowedError(originalError, mockNotificationService);

      expect(console.error).toHaveBeenCalledWith('Method Not Allowed Error: ', '');
    });

    it('should handle originalError with undefined message', () => {
      const originalError = {
        error: {
          message: undefined
        }
      };

      new MethodNotAllowedError(originalError, mockNotificationService);

      expect(console.error).toHaveBeenCalledWith('Method Not Allowed Error: ', undefined);
    });

    it('should handle originalError with null message', () => {
      const originalError = {
        error: {
          message: null
        }
      };

      new MethodNotAllowedError(originalError, mockNotificationService);

      expect(console.error).toHaveBeenCalledWith('Method Not Allowed Error: ', null);
    });

    it('should handle different notificationService implementations', () => {
      const originalError = {
        error: {
          message: 'Method not allowed'
        }
      };

      // Create a different mock
      const otherMockService = jasmine.createSpyObj('NotificationService', ['add']);

      new MethodNotAllowedError(originalError, otherMockService);

      expect(otherMockService.add).toHaveBeenCalledWith(
        'Hiba',
        'A funkció nem érhető el.',
        'danger' as NotificationType
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle originalError without error property', () => {
      const originalError = {} as any;

      expect(() => {
        new MethodNotAllowedError(originalError, mockNotificationService);
      }).not.toThrow();
    });

    it('should handle originalError with null error property', () => {
      const originalError = {
        error: null
      } as any;

      expect(() => {
        new MethodNotAllowedError(originalError, mockNotificationService);
      }).not.toThrow();
    });

    it('should handle originalError with undefined error property', () => {
      const originalError = {
        error: undefined
      } as any;

      expect(() => {
        new MethodNotAllowedError(originalError, mockNotificationService);
      }).not.toThrow();
    });

    it('should handle null originalError', () => {
      const originalError = null as any;

      expect(() => {
        new MethodNotAllowedError(originalError, mockNotificationService);
      }).not.toThrow();
    });

    it('should handle undefined originalError', () => {
      const originalError = undefined as any;

      expect(() => {
        new MethodNotAllowedError(originalError, mockNotificationService);
      }).not.toThrow();
    });

    it('should handle complex originalError structure', () => {
      const originalError = {
        status: 405,
        statusText: 'Method Not Allowed',
        error: {
          message: 'The method is not allowed for this resource',
          code: 'METHOD_NOT_ALLOWED',
          details: {
            allowedMethods: ['GET', 'POST']
          }
        }
      };

      new MethodNotAllowedError(originalError, mockNotificationService);

      expect(console.error).toHaveBeenCalledWith('Method Not Allowed Error: ', 'The method is not allowed for this resource');
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'A funkció nem érhető el.',
        'danger' as NotificationType
      );
    });
  });

  describe('Method Call Verification', () => {
    it('should call all required methods once', () => {
      const originalError = {
        error: {
          message: 'Method not allowed'
        }
      };

      new MethodNotAllowedError(originalError, mockNotificationService);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should call methods in correct order', () => {
      const originalError = {
        error: {
          message: 'Method not allowed'
        }
      };

      const callOrder: string[] = [];

      // Mock console.error to track call order
      (console.error as jasmine.Spy).and.callFake(() => {
        callOrder.push('console.error');
      });

      // Mock notificationService.add to track call order
      mockNotificationService.add.and.callFake(() => {
        callOrder.push('notificationService.add');
      });

      new MethodNotAllowedError(originalError, mockNotificationService);

      expect(callOrder).toEqual(['console.error', 'notificationService.add']);
    });

    it('should preserve original method functionality', () => {
      const originalError = {
        error: {
          message: 'Method not allowed'
        }
      };

      // Verify that methods are called with original functionality preserved
      new MethodNotAllowedError(originalError, mockNotificationService);

      expect(console.error).toHaveBeenCalledWith('Method Not Allowed Error: ', 'Method not allowed');
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'A funkció nem érhető el.',
        'danger' as NotificationType
      );
    });
  });

  describe('Class Properties', () => {
    it('should inherit properties from DdataCoreError', () => {
      const originalError = {
        error: {
          message: 'Method not allowed'
        }
      };

      const error = new MethodNotAllowedError(originalError, mockNotificationService);

      // Verify inherited properties from DdataCoreError
      expect(error.hasOwnProperty('msg') || 'msg' in error).toBe(true);
      expect(error.hasOwnProperty('originalError') || 'originalError' in error).toBe(true);
    });

    it('should maintain class name', () => {
      const originalError = {
        error: {
          message: 'Method not allowed'
        }
      };

      const error = new MethodNotAllowedError(originalError, mockNotificationService);

      expect(error.constructor.name).toBe('MethodNotAllowedError');
    });
  });
});