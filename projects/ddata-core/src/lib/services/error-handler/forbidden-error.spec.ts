import { ForbiddenError } from './forbidden-error';
import { DdataCoreError } from './ddata-core-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

describe('ForbiddenError', () => {
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    // Create a spy object for NotificationService
    mockNotificationService = jasmine.createSpyObj('NotificationService', ['add']);
    
    // Spy on console.error
    consoleErrorSpy = spyOn(console, 'error');
  });

  afterEach(() => {
    // Clean up spies
    consoleErrorSpy?.calls?.reset();
    mockNotificationService.add?.calls?.reset();
  });

  describe('Constructor', () => {
    it('should create an instance', () => {
      const originalError = {
        error: { message: 'Test error message' }
      };

      const forbiddenError = new ForbiddenError(originalError, mockNotificationService);

      expect(forbiddenError).toBeTruthy();
      expect(forbiddenError instanceof ForbiddenError).toBe(true);
      expect(forbiddenError instanceof DdataCoreError).toBe(true);
    });

    it('should call super constructor with originalError', () => {
      const originalError = {
        error: { message: 'Test error message' }
      };

      const forbiddenError = new ForbiddenError(originalError, mockNotificationService);

      // Check that the originalError is passed to the parent class
      expect(forbiddenError.originalError).toBe(originalError);
    });

    it('should log error to console with correct parameters', () => {
      const originalError = {
        error: { message: 'Test error message' }
      };

      new ForbiddenError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '403 - Forbidden Error: ',
        'Test error message',
        originalError
      );
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('should call notificationService.add with correct parameters', () => {
      const originalError = {
        error: { message: 'Test error message' }
      };

      new ForbiddenError(originalError, mockNotificationService);

      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nincs engedélyed ezt a műveletet végrehajtani.',
        'danger' as NotificationType
      );
      expect(mockNotificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle originalError without error.message', () => {
      const originalError = {
        error: { }
      };

      new ForbiddenError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '403 - Forbidden Error: ',
        undefined,
        originalError
      );
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nincs engedélyed ezt a műveletet végrehajtani.',
        'danger' as NotificationType
      );
    });

    it('should handle originalError without error property', () => {
      const originalError = {};

      new ForbiddenError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '403 - Forbidden Error: ',
        undefined,
        originalError
      );
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nincs engedélyed ezt a műveletet végrehajtani.',
        'danger' as NotificationType
      );
    });

    it('should handle null originalError', () => {
      const originalError = null;

      new ForbiddenError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '403 - Forbidden Error: ',
        undefined,
        originalError
      );
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nincs engedélyed ezt a műveletet végrehajtani.',
        'danger' as NotificationType
      );
    });

    it('should handle undefined originalError', () => {
      const originalError = undefined;

      new ForbiddenError(originalError, mockNotificationService);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '403 - Forbidden Error: ',
        undefined,
        originalError
      );
      expect(mockNotificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nincs engedélyed ezt a műveletet végrehajtani.',
        'danger' as NotificationType
      );
    });
  });

  describe('Inheritance from DdataCoreError', () => {
    it('should inherit from DdataCoreError', () => {
      const originalError = {
        error: { message: 'Test error message' }
      };

      const forbiddenError = new ForbiddenError(originalError, mockNotificationService);

      expect(forbiddenError instanceof DdataCoreError).toBe(true);
    });

    it('should have msg property from parent class', () => {
      const originalError = {
        error: { 
          message: 'Test error message',
          trace: [
            { file: 'app/Http/Controllers/TestController.php', line: 123 }
          ]
        }
      };

      const forbiddenError = new ForbiddenError(originalError, mockNotificationService);

      expect(forbiddenError.msg).toBeDefined();
      expect(typeof forbiddenError.msg).toBe('string');
      expect(forbiddenError.msg).toContain('app/Http/Controllers/TestController.php:123');
    });

    it('should handle parent class logic for trace processing', () => {
      const originalError = {
        error: { 
          message: 'Test error message',
          trace: [
            { file: 'app/Http/Controllers/TestController.php', line: 123 },
            { file: 'vendor/laravel/framework/src/Illuminate/Http/Controller.php', line: 456 },
            { file: 'app/Http/Controllers/AnotherController.php', line: 789 }
          ]
        }
      };

      const forbiddenError = new ForbiddenError(originalError, mockNotificationService);

      // Should include controller files but not framework files
      expect(forbiddenError.msg).toContain('app/Http/Controllers/TestController.php:123');
      expect(forbiddenError.msg).toContain('app/Http/Controllers/AnotherController.php:789');
      expect(forbiddenError.msg).not.toContain('vendor/laravel');
    });

    it('should handle empty trace array in parent class', () => {
      const originalError = {
        error: { 
          message: 'Test error message',
          trace: []
        }
      };

      const forbiddenError = new ForbiddenError(originalError, mockNotificationService);

      expect(forbiddenError.msg).toBe('');
    });

    it('should handle trace entries missing file or line', () => {
      const originalError = {
        error: { 
          message: 'Test error message',
          trace: [
            { file: 'app/Http/Controllers/TestController.php' }, // missing line
            { line: 123 }, // missing file
            { file: 'app/Http/Controllers/ValidController.php', line: 456 } // valid
          ]
        }
      };

      const forbiddenError = new ForbiddenError(originalError, mockNotificationService);

      expect(forbiddenError.msg).toBe('app/Http/Controllers/ValidController.php:456');
    });
  });
});