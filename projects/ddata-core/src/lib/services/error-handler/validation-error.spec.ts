import { AppValidationError } from './validation-error';
import { DdataCoreError } from './ddata-core-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

describe('AppValidationError', () => {
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let consoleSpy: jasmine.Spy;

  beforeEach(() => {
    // Create spy for NotificationService
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['add']);
    
    // Spy on console.error
    consoleSpy = spyOn(console, 'error');
  });

  afterEach(() => {
    // Clean up spies
    consoleSpy.calls.reset();
    mockNotificationService.add.calls.reset();
  });

  describe('Constructor', () => {
    it('should create an instance and call super constructor', () => {
      const originalError = {
        error: {
          message: 'Test error'
        }
      };

      const error = new AppValidationError(originalError, mockNotificationService);

      expect(error).toBeTruthy();
      expect(error).toBeInstanceOf(AppValidationError);
      expect(error).toBeInstanceOf(DdataCoreError);
    });

    it('should log error to console', () => {
      const originalError = {
        error: {
          message: 'Test error'
        }
      };

      new AppValidationError(originalError, mockNotificationService);

      expect(consoleSpy).toHaveBeenCalledWith('Validation Error: ', originalError.error);
    });

    it('should call notificationService.add with default message when no errors or invalids', () => {
      const originalError = {
        error: {
          message: 'Test error'
        }
      };

      new AppValidationError(originalError, mockNotificationService);

      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Valamelyik adatmező nem a megfeleő formátumú',
        'danger' as NotificationType
      );
    });

    it('should use errors message when originalError.error.errors exists', () => {
      const originalError = {
        error: {
          errors: {
            field1: 'Error message 1',
            field2: 'Error message 2',
            field3: 'Error message 3'
          }
        }
      };

      new AppValidationError(originalError, mockNotificationService);

      const expectedMessage = Object.values(originalError.error.errors).join('<br>');
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        expectedMessage,
        'danger' as NotificationType
      );
    });

    it('should use invalids message when originalError.error.invalids exists', () => {
      const originalError = {
        error: {
          invalids: ['field1', 'field2', 'field3']
        }
      };

      new AppValidationError(originalError, mockNotificationService);

      const expectedMessage = 'A következő mezők rosszul lettek kitöltve:<br>' + originalError.error.invalids.join(', ');
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        expectedMessage,
        'danger' as NotificationType
      );
    });

    it('should prioritize invalids over errors when both exist', () => {
      const originalError = {
        error: {
          errors: {
            field1: 'Error message 1',
            field2: 'Error message 2'
          },
          invalids: ['field3', 'field4']
        }
      };

      new AppValidationError(originalError, mockNotificationService);

      // Based on the code, if both exist, invalids takes precedence (it's checked last)
      const expectedMessage = 'A következő mezők rosszul lettek kitöltve:<br>' + originalError.error.invalids.join(', ');
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        expectedMessage,
        'danger' as NotificationType
      );
    });

    it('should handle empty errors object', () => {
      const originalError = {
        error: {
          errors: {}
        }
      };

      new AppValidationError(originalError, mockNotificationService);

      // Empty object still passes !! check, so Object.values([]).join('<br>') = ''
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        '',
        'danger' as NotificationType
      );
    });

    it('should handle empty invalids array', () => {
      const originalError = {
        error: {
          invalids: []
        }
      };

      new AppValidationError(originalError, mockNotificationService);

      // Empty array still passes !! check
      const expectedMessage = 'A következő mezők rosszul lettek kitöltve:<br>';
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        expectedMessage,
        'danger' as NotificationType
      );
    });

    it('should handle null errors', () => {
      const originalError = {
        error: {
          errors: null
        }
      };

      new AppValidationError(originalError, mockNotificationService);

      // null doesn't pass !! check, so default message is used
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Valamelyik adatmező nem a megfeleő formátumú',
        'danger' as NotificationType
      );
    });

    it('should handle undefined errors', () => {
      const originalError = {
        error: {
          errors: undefined
        }
      };

      new AppValidationError(originalError, mockNotificationService);

      // undefined doesn't pass !! check, so default message is used
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Valamelyik adatmező nem a megfeleő formátumú',
        'danger' as NotificationType
      );
    });

    it('should handle null invalids', () => {
      const originalError = {
        error: {
          invalids: null
        }
      };

      new AppValidationError(originalError, mockNotificationService);

      // null doesn't pass !! check, so default message is used
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Valamelyik adatmező nem a megfeleő formátumú',
        'danger' as NotificationType
      );
    });

    it('should handle undefined invalids', () => {
      const originalError = {
        error: {
          invalids: undefined
        }
      };

      new AppValidationError(originalError, mockNotificationService);

      // undefined doesn't pass !! check, so default message is used
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Valamelyik adatmező nem a megfeleő formátumú',
        'danger' as NotificationType
      );
    });

    it('should handle falsy errors (false, 0)', () => {
      const originalError = {
        error: {
          errors: false
        }
      };

      new AppValidationError(originalError, mockNotificationService);

      // false doesn't pass !! check, so default message is used
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Valamelyik adatmező nem a megfeleő formátumú',
        'danger' as NotificationType
      );
    });

    it('should handle missing error property', () => {
      const originalError = {};

      expect(() => {
        new AppValidationError(originalError, mockNotificationService);
      }).toThrow();
    });

    it('should handle originalError with no error property', () => {
      const originalError = {
        message: 'Some error'
      };

      expect(() => {
        new AppValidationError(originalError, mockNotificationService);
      }).toThrow();
    });
  });

  describe('Inheritance', () => {
    it('should inherit from DdataCoreError', () => {
      const originalError = {
        error: {
          message: 'Test error'
        }
      };

      const error = new AppValidationError(originalError, mockNotificationService);

      expect(error instanceof DdataCoreError).toBe(true);
    });

    it('should have properties from DdataCoreError', () => {
      const originalError = {
        error: {
          message: 'Test error'
        }
      };

      const error = new AppValidationError(originalError, mockNotificationService);

      // DdataCoreError has msg property and originalError property
      expect(error.hasOwnProperty('msg') || 'msg' in error).toBe(true);
      expect(error.hasOwnProperty('originalError') || 'originalError' in error).toBe(true);
    });
  });

  describe('Error types verification', () => {
    it('should work with complex error objects', () => {
      const originalError = {
        error: {
          errors: {
            'email': 'Invalid email format',
            'password': 'Password too short',
            'confirmPassword': 'Passwords do not match'
          },
          invalids: ['username', 'age'],
          other: 'some other property'
        }
      };

      new AppValidationError(originalError, mockNotificationService);

      // Should use invalids since it's checked last
      const expectedMessage = 'A következő mezők rosszul lettek kitöltve:<br>username, age';
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        expectedMessage,
        'danger' as NotificationType
      );
    });

    it('should work with string values in errors object', () => {
      const originalError = {
        error: {
          errors: {
            'field1': 'Error 1',
            'field2': 'Error 2'
          }
        }
      };

      new AppValidationError(originalError, mockNotificationService);

      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Error 1<br>Error 2',
        'danger' as NotificationType
      );
    });

    it('should work with mixed value types in errors object', () => {
      const originalError = {
        error: {
          errors: {
            'field1': 'String error',
            'field2': 123,
            'field3': true,
            'field4': null
          }
        }
      };

      new AppValidationError(originalError, mockNotificationService);

      const expectedMessage = Object.values(originalError.error.errors).join('<br>');
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        expectedMessage,
        'danger' as NotificationType
      );
    });
  });
});