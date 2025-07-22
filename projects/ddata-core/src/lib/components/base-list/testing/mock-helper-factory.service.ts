import { HelperFactoryService } from '../../../services/helper/helper-service.factory';
import { HelperServiceInterface } from '../../../services/helper/helper-service.interface';
import { TestModelInterface } from './test-model.interface';
import { MockHelperService } from './mock-helper.service';

// Mock HelperFactoryService
export class MockHelperFactoryService extends HelperFactoryService<TestModelInterface> {
  get(newable: new() => TestModelInterface): HelperServiceInterface<TestModelInterface> {
    return new MockHelperService();
  }
}