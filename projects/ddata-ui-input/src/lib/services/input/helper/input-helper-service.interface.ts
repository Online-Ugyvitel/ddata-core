import { BaseModelInterface, FieldsInterface } from '@netdjw/ddata-core';

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
  getErrorText(
    model: BaseModelInterface<unknown> & FieldsInterface<unknown>,
    field: string,
    override: string,
    suggestion?: string
  ): string;
  buildDescribedBy(
    helpId: string | null,
    errorId: string | null,
    counterId: string | null
  ): string | null;
  randChars(): string;
}
