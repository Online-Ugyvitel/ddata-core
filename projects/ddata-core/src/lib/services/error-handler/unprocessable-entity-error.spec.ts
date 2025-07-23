import { TestBed } from '@angular/core/testing';
import { UnprocessableEntity } from './unprocessable-entity-error';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../models/base/base-data.type';

describe('UnprocessableEntity', () => {
  let notificationService: jasmine.SpyObj<NotificationService>;
  let consoleErrorSpy: jasmine.Spy;

  beforeEach(() => {
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    });

    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    consoleErrorSpy = spyOn(console, 'error');
  });

  afterEach(() => {
    consoleErrorSpy.calls.reset();
    notificationService.add.calls.reset();
  });

  describe('1. Constructor Tests', () => {
    it('should create an instance and extend DdataCoreError', () => {
      const originalError = { error: { message: 'Test error' } };
      const instance = new UnprocessableEntity(originalError, notificationService);
      
      expect(instance).toBeTruthy();
      expect(instance).toBeDefined();
      expect(instance.originalError).toBe(originalError);
    });

    it('should log console error with original error message', () => {
      const originalError = { error: { message: 'Test error message' } };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Unprocessable Entry Error: ', 'Test error message');
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('should log console error even when no error message exists', () => {
      const originalError = { error: {} };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Unprocessable Entry Error: ', undefined);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });

    it('should log console error when originalError has no error property', () => {
      const originalError = { someOtherProperty: 'value' };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Unprocessable Entry Error: ', undefined);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('2. Error Message Extraction Tests', () => {
    it('should use error message when originalError.error.message exists', () => {
      const originalError = { error: { message: 'Specific error message' } };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Specific error message',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should use error as string when originalError.error is a string', () => {
      const originalError = { error: 'String error message' };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'String error message',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should use fallback message when originalError.error exists but has no message and is not string', () => {
      const originalError = { error: { someOtherProperty: 'value' } };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nem feldolgozható kérés',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should use fallback message when originalError has no error property', () => {
      const originalError = { someOtherProperty: 'value' };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nem feldolgozható kérés',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should use fallback message when originalError.error is null', () => {
      const originalError = { error: null };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nem feldolgozható kérés',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should use fallback message when originalError.error is undefined', () => {
      const originalError = { error: undefined };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nem feldolgozható kérés',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should use fallback message when originalError.error.message is empty string', () => {
      const originalError = { error: { message: '' } };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nem feldolgozható kérés',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should use fallback message when originalError.error.message is null', () => {
      const originalError = { error: { message: null } };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nem feldolgozható kérés',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should use fallback message when originalError.error.message is undefined', () => {
      const originalError = { error: { message: undefined } };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nem feldolgozható kérés',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('3. Edge Cases and Complex Scenarios', () => {
    it('should handle empty string error correctly', () => {
      const originalError = { error: '' };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nem feldolgozható kérés',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle numeric error correctly', () => {
      const originalError = { error: 404 };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nem feldolgozható kérés',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle boolean error correctly', () => {
      const originalError = { error: false };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nem feldolgozható kérés',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle array error correctly', () => {
      const originalError = { error: ['error1', 'error2'] };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nem feldolgozható kérés',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle complex nested error object', () => {
      const originalError = { 
        error: { 
          message: 'Complex error message',
          code: 422,
          details: {
            field: 'validation failed'
          }
        } 
      };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Complex error message',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle null originalError', () => {
      const originalError = null;
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nem feldolgozható kérés',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Unprocessable Entry Error: ', undefined);
    });

    it('should handle undefined originalError', () => {
      const originalError = undefined;
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Nem feldolgozható kérés',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Unprocessable Entry Error: ', undefined);
    });
  });

  describe('4. Notification Service Integration', () => {
    it('should always call notificationService.add with correct parameters', () => {
      const originalError = { error: { message: 'Test message' } };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Test message',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should call notificationService.add only once per instance', () => {
      const originalError = { error: { message: 'Test message' } };
      
      new UnprocessableEntity(originalError, notificationService);
      
      expect(notificationService.add).toHaveBeenCalledTimes(1);
    });

    it('should use danger notification type consistently', () => {
      const testCases = [
        { error: { message: 'Message error' } },
        { error: 'String error' },
        { error: {} },
        { someOtherProperty: 'value' }
      ];

      testCases.forEach((originalError, index) => {
        notificationService.add.calls.reset();
        
        new UnprocessableEntity(originalError, notificationService);
        
        expect(notificationService.add).toHaveBeenCalledWith(
          jasmine.any(String),
          jasmine.any(String),
          'danger' as NotificationType
        );
      });
    });
  });

  describe('5. Comprehensive Integration Tests', () => {
    it('should perform all expected actions: console.error, notificationService.add, and super constructor call', () => {
      const originalError = { error: { message: 'Integration test message' } };
      
      const instance = new UnprocessableEntity(originalError, notificationService);
      
      // Verify console.error was called
      expect(consoleErrorSpy).toHaveBeenCalledWith('Unprocessable Entry Error: ', 'Integration test message');
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      
      // Verify notificationService.add was called
      expect(notificationService.add).toHaveBeenCalledWith(
        'Hiba',
        'Integration test message',
        'danger' as NotificationType
      );
      expect(notificationService.add).toHaveBeenCalledTimes(1);
      
      // Verify super constructor was called (originalError is set)
      expect(instance.originalError).toBe(originalError);
    });

    it('should handle multiple instances independently', () => {
      const error1 = { error: { message: 'First error' } };
      const error2 = { error: 'Second error' };
      
      const instance1 = new UnprocessableEntity(error1, notificationService);
      const instance2 = new UnprocessableEntity(error2, notificationService);
      
      expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
      expect(notificationService.add).toHaveBeenCalledTimes(2);
      
      expect(instance1.originalError).toBe(error1);
      expect(instance2.originalError).toBe(error2);
    });
  });
});