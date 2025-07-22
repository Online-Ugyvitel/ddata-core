import { DataServiceAbstract } from './data-service.abstract';
import { MockModel } from './mock-model';

/**
 * Concrete test implementation of DataServiceAbstract for testing purposes
 */
export class TestDataService extends DataServiceAbstract<MockModel> {
  constructor(model: MockModel) {
    super(model);
  }
}