import { BaseModelInterface } from '../../../models/base/base-model.model';

// Test model interface
export interface TestModelInterface extends BaseModelInterface<TestModelInterface> {
  name: string;
}