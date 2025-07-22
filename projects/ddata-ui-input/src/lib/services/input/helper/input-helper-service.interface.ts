import { BaseModelInterface, FieldsInterface } from 'ddata-core';

export interface InputHelperServiceInterface {
  validateField(
    model: BaseModelInterface<unknown> & FieldsInterface<unknown>,
    field: string
  ): boolean;
  getTitle(model: BaseModelInterface<unknown> & FieldsInterface<unknown>, field: string): string;
  getLabel(model: BaseModelInterface<unknown> & FieldsInterface<unknown>, field: string): string;
  getPlaceholder(
    model: BaseModelInterface<unknown> & FieldsInterface<unknown>,
    field: string
  ): string;
  getPrepend(model: BaseModelInterface<unknown> & FieldsInterface<unknown>, field: string): string;
  getAppend(model: BaseModelInterface<unknown> & FieldsInterface<unknown>, field: string): string;
  isRequired(model: BaseModelInterface<unknown> & FieldsInterface<unknown>, field: string): boolean;
  randChars(): string;
}
