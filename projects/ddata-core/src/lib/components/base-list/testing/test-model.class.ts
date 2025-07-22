import { ValidationRuleInterface } from '../../../models/base/base-model.model';
import { ID, ISODate } from '../../../models/base/base-data.type';
import { TestModelInterface } from './test-model.interface';

// Test model implementation
export class TestModel implements TestModelInterface {
  readonly api_endpoint = '/test';
  readonly model_name = 'TestModel';
  readonly use_localstorage = false;
  
  id: ID = 0 as ID;
  name: string = '';
  tabs?: any;
  isValid = false;
  validationErrors: string[] = [];
  validationRules: ValidationRuleInterface = {};

  init(data?: any): TestModelInterface {
    const incoming = !!data ? data : {};
    this.id = !!incoming.id ? incoming.id as ID : 0 as ID;
    this.name = !!incoming.name ? incoming.name : '';
    return this;
  }

  // Implement all required methods from BaseModelInterface
  fieldAsBoolean(field: string, defaultValue: boolean, data: unknown): void {
    this[field] = data && data[field] !== undefined ? data[field] : defaultValue;
  }

  fieldAsNumber(field: string, defaultValue: number, data: unknown): void {
    this[field] = data && data[field] !== undefined ? data[field] : defaultValue;
  }

  fieldAsString(field: string, defaultValue: string, data: unknown): void {
    this[field] = data && data[field] !== undefined ? data[field] : defaultValue;
  }

  initModelOrNull(fields: Partial<TestModelInterface>, data: unknown): void {
    Object.keys(fields).forEach((field: string) => {
      this[field] = fields[field]?.init(data[field]) ?? null;
    });
  }

  initAsBoolean(fields: Partial<TestModelInterface>, data: unknown): void {
    Object.keys(fields).forEach((field: string) => {
      this.fieldAsBoolean(field, fields[field], data);
    });
  }

  initAsBooleanWithDefaults(fields: Array<string>, data: unknown): void {
    fields.forEach((field: string) => {
      this.fieldAsBoolean(field, false, data);
    });
  }

  initAsNumber(fields: Partial<TestModelInterface>, data: unknown): void {
    Object.keys(fields).forEach((field: string) => {
      this.fieldAsNumber(field, fields[field], data);
    });
  }

  initAsNumberWithDefaults(fields: Array<string>, data: unknown): void {
    fields.forEach((field: string) => {
      this.fieldAsNumber(field, 0, data);
    });
  }

  initAsString(fields: Partial<TestModelInterface>, data: unknown): void {
    Object.keys(fields).forEach((field: string) => {
      this.fieldAsString(field, fields[field], data);
    });
  }

  initAsStringWithDefaults(fields: Array<string>, data: unknown): void {
    fields.forEach((field: string) => {
      this.fieldAsString(field, '', data);
    });
  }

  prepareFieldsToSaveAsBoolean(fields: Partial<TestModelInterface>): Partial<TestModelInterface> {
    return fields;
  }

  prepareFieldsToSaveAsNumber(fields: Partial<TestModelInterface>): Partial<TestModelInterface> {
    return fields;
  }

  prepareFieldsToSaveAsString(fields: Partial<TestModelInterface>): Partial<TestModelInterface> {
    return fields;
  }

  prepareToSave(): any {
    return {
      id: this.id,
      name: this.name
    };
  }

  validate(): void {
    this.isValid = true;
  }

  getValidatedErrorFields(): string[] {
    return this.validationErrors;
  }

  setDate(date: Date, days: number): ISODate {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    return newDate.toISOString().split('T')[0] as ISODate;
  }

  getCurrentUserId(): ID {
    return 1 as ID;
  }

  getCurrentISODate(): ISODate {
    return new Date().toISOString().split('T')[0] as ISODate;
  }

  toISODate(date: Date): ISODate {
    return date.toISOString().split('T')[0] as ISODate;
  }

  toISODatetime(date: Date): string {
    return date.toISOString();
  }

  calculateDateWithoutWeekend(date: string, days: number, sequence: string): ISODate {
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() + days);
    return startDate.toISOString().split('T')[0] as ISODate;
  }

  getCurrentTime(): string {
    return new Date().toTimeString();
  }
}