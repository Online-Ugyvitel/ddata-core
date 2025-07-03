import { NotificationType } from '../base/base-data.type';
import { NotificationInterface } from './notification.interface';
import { Notification } from './notification.model';

describe('Notification', () => {
  let notification: Notification;
  const testText = 'Test notification message';
  const testTitle = 'Test Title';
  const testType = 'success' as NotificationType;
  const testSeconds = 10;

  describe('constructor', () => {
    it('should create an instance with default seconds parameter', () => {
      notification = new Notification(testText, testTitle, testType);
      
      expect(notification).toBeTruthy();
      expect(notification instanceof Notification).toBe(true);
    });

    it('should create an instance with custom seconds parameter', () => {
      notification = new Notification(testText, testTitle, testType, testSeconds);
      
      expect(notification).toBeTruthy();
      expect(notification instanceof Notification).toBe(true);
    });
  });

  describe('properties', () => {
    beforeEach(() => {
      notification = new Notification(testText, testTitle, testType, testSeconds);
    });

    it('should have all required properties', () => {
      expect(notification.text).toBeDefined();
      expect(notification.title).toBeDefined();
      expect(notification.type).toBeDefined();
      expect(notification.createdTime).toBeDefined();
    });

    it('should set text property correctly', () => {
      expect(notification.text).toBe(testText);
      expect(typeof notification.text).toBe('string');
    });

    it('should set title property correctly', () => {
      expect(notification.title).toBe(testTitle);
      expect(typeof notification.title).toBe('string');
    });

    it('should set type property correctly', () => {
      expect(notification.type).toBe(testType);
      expect(typeof notification.type).toBe('string');
    });

    it('should set createdTime property correctly', () => {
      expect(notification.createdTime).toBeInstanceOf(Date);
      expect(typeof notification.createdTime).toBe('object');
    });
  });

  describe('type validation', () => {
    it('should implement NotificationInterface', () => {
      notification = new Notification(testText, testTitle, testType);
      
      // Check that the instance has all properties required by the interface
      const notificationInterface: NotificationInterface = notification;
      expect(notificationInterface.text).toBeDefined();
      expect(notificationInterface.title).toBeDefined();
      expect(notificationInterface.type).toBeDefined();
      expect(notificationInterface.createdTime).toBeDefined();
    });

    it('should have correct property types as defined in interface', () => {
      notification = new Notification(testText, testTitle, testType);
      
      expect(typeof notification.text).toBe('string');
      expect(typeof notification.title).toBe('string');
      expect(typeof notification.type).toBe('string');
      expect(notification.createdTime instanceof Date).toBe(true);
    });
  });

  describe('createdTime calculation', () => {
    it('should add default 5 seconds to current time when no seconds parameter provided', () => {
      const startTime = new Date();
      notification = new Notification(testText, testTitle, testType);
      
      const expectedTime = new Date(startTime);
      expectedTime.setSeconds(expectedTime.getSeconds() + 5);
      
      // Allow for small time difference due to test execution time
      const timeDiff = Math.abs(notification.createdTime.getTime() - expectedTime.getTime());
      expect(timeDiff).toBeLessThan(1000); // within 1 second
    });

    it('should add custom seconds to current time when seconds parameter provided', () => {
      const startTime = new Date();
      notification = new Notification(testText, testTitle, testType, testSeconds);
      
      const expectedTime = new Date(startTime);
      expectedTime.setSeconds(expectedTime.getSeconds() + testSeconds);
      
      // Allow for small time difference due to test execution time
      const timeDiff = Math.abs(notification.createdTime.getTime() - expectedTime.getTime());
      expect(timeDiff).toBeLessThan(1000); // within 1 second
    });

    it('should handle zero seconds parameter', () => {
      const startTime = new Date();
      notification = new Notification(testText, testTitle, testType, 0);
      
      const expectedTime = new Date(startTime);
      expectedTime.setSeconds(expectedTime.getSeconds() + 0);
      
      // Allow for small time difference due to test execution time
      const timeDiff = Math.abs(notification.createdTime.getTime() - expectedTime.getTime());
      expect(timeDiff).toBeLessThan(1000); // within 1 second
    });

    it('should handle negative seconds parameter', () => {
      const startTime = new Date();
      notification = new Notification(testText, testTitle, testType, -10);
      
      const expectedTime = new Date(startTime);
      expectedTime.setSeconds(expectedTime.getSeconds() - 10);
      
      // Allow for small time difference due to test execution time
      const timeDiff = Math.abs(notification.createdTime.getTime() - expectedTime.getTime());
      expect(timeDiff).toBeLessThan(1000); // within 1 second
    });
  });

  describe('different notification types', () => {
    const notificationTypes = ['success', 'warning', 'danger', 'info', 'primary', 'secondary', 'light', 'dark'];

    notificationTypes.forEach(type => {
      it(`should create notification with type: ${type}`, () => {
        notification = new Notification(testText, testTitle, type as NotificationType);
        
        expect(notification.type).toBe(type);
        expect(typeof notification.type).toBe('string');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty string values', () => {
      notification = new Notification('', '', '' as NotificationType);
      
      expect(notification.text).toBe('');
      expect(notification.title).toBe('');
      expect(notification.type).toBe('');
      expect(notification.createdTime).toBeInstanceOf(Date);
    });

    it('should handle very long string values', () => {
      const longText = 'a'.repeat(1000);
      const longTitle = 'b'.repeat(500);
      
      notification = new Notification(longText, longTitle, testType);
      
      expect(notification.text).toBe(longText);
      expect(notification.title).toBe(longTitle);
      expect(notification.text.length).toBe(1000);
      expect(notification.title.length).toBe(500);
    });

    it('should handle special characters in text and title', () => {
      const specialText = 'Test with special chars: éáűőú @#$%^&*()';
      const specialTitle = 'Title with émojis 😀🎉 and symbols ™®©';
      
      notification = new Notification(specialText, specialTitle, testType);
      
      expect(notification.text).toBe(specialText);
      expect(notification.title).toBe(specialTitle);
    });
  });
});