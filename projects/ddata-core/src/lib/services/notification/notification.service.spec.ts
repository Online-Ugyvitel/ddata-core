/* eslint-disable jasmine/no-disabled-tests */
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

  it('should be created', () => {
    const service: NotificationService = TestBed.inject(NotificationService);

    expect(service).toBeTruthy();
  });
});
