import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs/operators';

import { NotificationService } from './notification.service';
import { Notification } from '../../models/notification/notification.model';
import { NotificationType } from '../../models/base/base-data.type';
import { BaseModelInterface } from '../../models/base/base-model.model';

// Mock BaseModel for testing showValidationError
class MockBaseModel implements BaseModelInterface<any> {
  readonly api_endpoint = '/mock';
  readonly use_localstorage = false;
  readonly model_name = 'MockModel';
  id = 1 as any;
  isValid = false;
  validationErrors: string[] = [];
  validationRules = {};

  init = jasmine.createSpy('init').and.returnValue(this);
  prepareToSave = jasmine.createSpy('prepareToSave').and.returnValue({});
  validate = jasmine.createSpy('validate');
  getValidatedErrorFields = jasmine.createSpy('getValidatedErrorFields').and.returnValue(['field1', 'field2']);
  setDate = jasmine.createSpy('setDate').and.returnValue('2023-01-01' as any);
  getCurrentUserId = jasmine.createSpy('getCurrentUserId').and.returnValue(1 as any);
  getCurrentISODate = jasmine.createSpy('getCurrentISODate').and.returnValue('2023-01-01' as any);
  toISODate = jasmine.createSpy('toISODate').and.returnValue('2023-01-01' as any);
  toISODatetime = jasmine.createSpy('toISODatetime').and.returnValue('2023-01-01 12:00:00');
  calculateDateWithoutWeekend = jasmine.createSpy('calculateDateWithoutWeekend').and.returnValue('2023-01-01' as any);
  getCurrentTime = jasmine.createSpy('getCurrentTime').and.returnValue('12:00');
  tabs = undefined;
  fieldAsBoolean = jasmine.createSpy('fieldAsBoolean');
  fieldAsNumber = jasmine.createSpy('fieldAsNumber');
  fieldAsString = jasmine.createSpy('fieldAsString');
  initModelOrNull = jasmine.createSpy('initModelOrNull');
  initAsBoolean = jasmine.createSpy('initAsBoolean');
  initAsBooleanWithDefaults = jasmine.createSpy('initAsBooleanWithDefaults');
  initAsNumber = jasmine.createSpy('initAsNumber');
  initAsNumberWithDefaults = jasmine.createSpy('initAsNumberWithDefaults');
  initAsString = jasmine.createSpy('initAsString');
  initAsStringWithDefaults = jasmine.createSpy('initAsStringWithDefaults');
  prepareFieldsToSaveAsBoolean = jasmine.createSpy('prepareFieldsToSaveAsBoolean').and.returnValue({});
  prepareFieldsToSaveAsNumber = jasmine.createSpy('prepareFieldsToSaveAsNumber').and.returnValue({});
  prepareFieldsToSaveAsString = jasmine.createSpy('prepareFieldsToSaveAsString').and.returnValue({});
}

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  describe('1. Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
      expect(service).toBeDefined();
    });

    it('should be created as correct type', () => {
      expect(service).toBeInstanceOf(NotificationService);
      expect(service.constructor.name).toBe('NotificationService');
    });

    it('should initialize with empty notifications array', () => {
      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications).toEqual([]);
      });
    });
  });

  describe('2. add() Method', () => {
    it('should have add method', () => {
      expect(typeof service.add).toBe('function');
      expect(service.add).toBeDefined();
    });

    it('should add notification to the array', () => {
      const title = 'Test Title';
      const text = 'Test Text';
      const type = 'success' as NotificationType;

      service.add(title, text, type);

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0]).toBeInstanceOf(Notification);
        expect(notifications[0].title).toBe(title);
        expect(notifications[0].text).toBe(text);
        expect(notifications[0].type).toBe(type);
        expect(notifications[0].createdTime).toBeInstanceOf(Date);
      });
    });

    it('should add multiple notifications', () => {
      service.add('Title 1', 'Text 1', 'success' as NotificationType);
      service.add('Title 2', 'Text 2', 'warning' as NotificationType);
      service.add('Title 3', 'Text 3', 'danger' as NotificationType);

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(3);
        expect(notifications[0].title).toBe('Title 1');
        expect(notifications[1].title).toBe('Title 2');
        expect(notifications[2].title).toBe('Title 3');
      });
    });

    it('should emit notifications through watch observable', (done) => {
      const title = 'Test Title';
      const text = 'Test Text';
      const type = 'success' as NotificationType;

      let emissionCount = 0;
      service.watch().subscribe(notifications => {
        emissionCount++;
        if (emissionCount === 1) {
          // First emission after add
          expect(notifications.length).toBe(1);
          expect(notifications[0].title).toBe(title);
          done();
        }
      });

      service.add(title, text, type);
    });

    it('should set auto-delete timeout for 7 seconds', (done) => {
      jasmine.clock().install();
      
      service.add('Test Title', 'Test Text', 'success' as NotificationType);
      
      // Initially should have 1 notification
      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(1);
      });

      // After 7 seconds, notification should be deleted
      jasmine.clock().tick(7001);
      
      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(0);
        jasmine.clock().uninstall();
        done();
      });
    });

    it('should handle different notification types', () => {
      const types: NotificationType[] = ['success', 'warning', 'danger'] as NotificationType[];
      
      types.forEach((type, index) => {
        service.add(`Title ${index}`, `Text ${index}`, type);
      });

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(3);
        types.forEach((type, index) => {
          expect(notifications[index].type).toBe(type);
        });
      });
    });
  });

  describe('3. watch() Method', () => {
    it('should have watch method', () => {
      expect(typeof service.watch).toBe('function');
      expect(service.watch).toBeDefined();
    });

    it('should return an Observable', () => {
      const observable = service.watch();
      expect(observable).toBeDefined();
      expect(typeof observable.subscribe).toBe('function');
    });

    it('should emit current notifications state', (done) => {
      // Add some notifications first
      service.add('Title 1', 'Text 1', 'success' as NotificationType);
      service.add('Title 2', 'Text 2', 'warning' as NotificationType);

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(2);
        expect(notifications[0].title).toBe('Title 1');
        expect(notifications[1].title).toBe('Title 2');
        done();
      });
    });

    it('should emit updates when notifications change', (done) => {
      let emissionCount = 0;
      const expectedEmissions = [
        { length: 1, title: 'First' },
        { length: 2, title: 'Second' },
        { length: 1, title: 'First' } // After deleting second
      ];

      service.watch().subscribe(notifications => {
        const expected = expectedEmissions[emissionCount];
        if (expected) {
          expect(notifications.length).toBe(expected.length);
          if (notifications.length > 0) {
            expect(notifications[0].title).toBe(expected.title);
          }
          emissionCount++;
          
          if (emissionCount === expectedEmissions.length) {
            done();
          }
        }
      });

      service.add('First', 'Text 1', 'success' as NotificationType);
      service.add('Second', 'Text 2', 'warning' as NotificationType);
      service.delete(1); // Delete second notification
    });
  });

  describe('4. delete() Method', () => {
    beforeEach(() => {
      // Add some test notifications
      service.add('Title 1', 'Text 1', 'success' as NotificationType);
      service.add('Title 2', 'Text 2', 'warning' as NotificationType);
      service.add('Title 3', 'Text 3', 'danger' as NotificationType);
    });

    it('should have delete method', () => {
      expect(typeof service.delete).toBe('function');
      expect(service.delete).toBeDefined();
    });

    it('should remove notification at specified index', () => {
      service.delete(1); // Remove middle notification

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(2);
        expect(notifications[0].title).toBe('Title 1');
        expect(notifications[1].title).toBe('Title 3');
      });
    });

    it('should remove first notification', () => {
      service.delete(0);

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(2);
        expect(notifications[0].title).toBe('Title 2');
        expect(notifications[1].title).toBe('Title 3');
      });
    });

    it('should remove last notification', () => {
      service.delete(2);

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(2);
        expect(notifications[0].title).toBe('Title 1');
        expect(notifications[1].title).toBe('Title 2');
      });
    });

    it('should emit updated notifications after deletion', (done) => {
      let emissionCount = 0;
      service.watch().subscribe(notifications => {
        emissionCount++;
        if (emissionCount === 2) { // Second emission after deletion
          expect(notifications.length).toBe(2);
          expect(notifications[0].title).toBe('Title 1');
          expect(notifications[1].title).toBe('Title 3');
          done();
        }
      });

      service.delete(1);
    });

    it('should handle deletion of all notifications', () => {
      service.delete(0);
      service.delete(0);
      service.delete(0);

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(0);
      });
    });

    it('should handle invalid index gracefully', () => {
      const originalLength = 3;
      
      // Try to delete with negative index
      service.delete(-1);
      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(originalLength);
      });

      // Try to delete with index beyond array length
      service.delete(10);
      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(originalLength);
      });
    });
  });

  describe('5. showValidationError() Method', () => {
    let mockModel: MockBaseModel;

    beforeEach(() => {
      mockModel = new MockBaseModel();
    });

    it('should have showValidationError method', () => {
      expect(typeof service.showValidationError).toBe('function');
      expect(service.showValidationError).toBeDefined();
    });

    it('should call getValidatedErrorFields on the model', () => {
      service.showValidationError(mockModel);
      expect(mockModel.getValidatedErrorFields).toHaveBeenCalled();
    });

    it('should add notification with danger type', () => {
      service.showValidationError(mockModel);

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].type).toBe('danger');
      });
    });

    it('should add notification with correct title', () => {
      service.showValidationError(mockModel);

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].title).toBe('Hiba');
      });
    });

    it('should format error message correctly', () => {
      const mockFields = ['Field 1', 'Field 2', 'Field 3'];
      mockModel.getValidatedErrorFields = jasmine.createSpy('getValidatedErrorFields').and.returnValue(mockFields);

      service.showValidationError(mockModel);

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].text).toBe('A következő mezők rosszul lettek kitöltve:<br>Field 1, Field 2, Field 3');
      });
    });

    it('should handle empty error fields', () => {
      mockModel.getValidatedErrorFields = jasmine.createSpy('getValidatedErrorFields').and.returnValue([]);

      service.showValidationError(mockModel);

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].text).toBe('A következő mezők rosszul lettek kitöltve:<br>');
      });
    });

    it('should handle single error field', () => {
      mockModel.getValidatedErrorFields = jasmine.createSpy('getValidatedErrorFields').and.returnValue(['Single Field']);

      service.showValidationError(mockModel);

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].text).toBe('A következő mezők rosszul lettek kitöltve:<br>Single Field');
      });
    });

    it('should create Notification instance', () => {
      service.showValidationError(mockModel);

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0]).toBeInstanceOf(Notification);
        expect(notifications[0].createdTime).toBeInstanceOf(Date);
      });
    });
  });

  describe('6. Integration Tests', () => {
    it('should handle mixed operations correctly', (done) => {
      let emissionCount = 0;
      const expectedStates = [
        1, // Add first
        2, // Add second  
        1, // Delete first
        2, // Add validation error
        1  // Delete second
      ];

      service.watch().subscribe(notifications => {
        if (emissionCount < expectedStates.length) {
          expect(notifications.length).toBe(expectedStates[emissionCount]);
          emissionCount++;
          
          if (emissionCount === expectedStates.length) {
            done();
          }
        }
      });

      // Perform mixed operations
      service.add('First', 'Text 1', 'success' as NotificationType);
      service.add('Second', 'Text 2', 'warning' as NotificationType);
      service.delete(0);
      
      const mockModel = new MockBaseModel();
      service.showValidationError(mockModel);
      service.delete(1);
    });

    it('should maintain notification order correctly', () => {
      service.add('A', 'Text A', 'success' as NotificationType);
      service.add('B', 'Text B', 'warning' as NotificationType);
      service.add('C', 'Text C', 'danger' as NotificationType);
      
      service.delete(1); // Remove B
      
      service.add('D', 'Text D', 'success' as NotificationType);

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(3);
        expect(notifications[0].title).toBe('A');
        expect(notifications[1].title).toBe('C');
        expect(notifications[2].title).toBe('D');
      });
    });

    it('should handle rapid consecutive operations', () => {
      // Add many notifications rapidly
      for (let i = 0; i < 10; i++) {
        service.add(`Title ${i}`, `Text ${i}`, 'success' as NotificationType);
      }
      
      // Delete some notifications
      service.delete(5);
      service.delete(3);
      service.delete(0);

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(7);
        // Verify remaining notifications are in correct order
        expect(notifications[0].title).toBe('Title 1');
        expect(notifications[1].title).toBe('Title 2');
        expect(notifications[2].title).toBe('Title 4');
      });
    });
  });

  describe('7. Edge Cases and Error Handling', () => {
    it('should handle empty string parameters in add method', () => {
      service.add('', '', '' as NotificationType);

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].title).toBe('');
        expect(notifications[0].text).toBe('');
        expect(notifications[0].type).toBe('');
      });
    });

    it('should handle null/undefined parameters gracefully', () => {
      // TypeScript won't allow this, but JavaScript could
      expect(() => {
        (service as any).add(null, undefined, null);
      }).not.toThrow();
    });

    it('should handle concurrent deletions', () => {
      service.add('Test 1', 'Text 1', 'success' as NotificationType);
      service.add('Test 2', 'Text 2', 'warning' as NotificationType);
      
      // Try to delete same index multiple times
      service.delete(0);
      service.delete(0);
      
      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(0);
      });
    });

    it('should maintain Subject integrity after many operations', () => {
      // Perform many operations to test Subject reliability
      for (let i = 0; i < 100; i++) {
        service.add(`Title ${i}`, `Text ${i}`, 'success' as NotificationType);
        if (i % 3 === 0 && i > 0) {
          service.delete(0);
        }
      }

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBeGreaterThan(0);
        expect(Array.isArray(notifications)).toBe(true);
      });
    });
  });

  describe('8. Memory Management', () => {
    it('should properly clean up after deletions', () => {
      const initialLength = 5;
      
      // Add notifications
      for (let i = 0; i < initialLength; i++) {
        service.add(`Title ${i}`, `Text ${i}`, 'success' as NotificationType);
      }
      
      // Delete all notifications
      for (let i = initialLength - 1; i >= 0; i--) {
        service.delete(i);
      }

      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(0);
        expect(notifications).toEqual([]);
      });
    });

    it('should handle timeout cleanup correctly', (done) => {
      jasmine.clock().install();
      
      service.add('Test', 'Text', 'success' as NotificationType);
      
      // Fast forward time to trigger timeout
      jasmine.clock().tick(7001);
      
      service.watch().pipe(take(1)).subscribe(notifications => {
        expect(notifications.length).toBe(0);
        jasmine.clock().uninstall();
        done();
      });
    });
  });
});
