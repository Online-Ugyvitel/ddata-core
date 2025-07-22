import {
  BaseModelInterface,
  DdataCoreModule,
  FieldsInterface,
  ValidatorService,
  ValidatorServiceInterface
} from 'ddata-core';
import { InputHelperServiceInterface } from './input-helper-service.interface';

export class InputHelperService implements InputHelperServiceInterface {
  validatorService: ValidatorServiceInterface =
    DdataCoreModule.InjectorInstance.get<ValidatorService>(ValidatorService);

  constructor() {}

  validateField(
    model: BaseModelInterface<unknown> & FieldsInterface<unknown>,
    field: string
  ): boolean {
    // handle missing validation rule
    if (!model.validationRules[field]) {
      console.error(`Missing validation rule:${field} from model: ${model.constructor.name}`);

      return false;
    }
    const isValid: boolean = this.validatorService.validate(
      model[field],
      model.validationRules[field]
    );

    // if not valid & validation error is not set
    if (!isValid && !model.validationErrors.includes(field)) {
      model.validationErrors.push(field);

      return false;
    }

    // it's valid & validation error set - need remove
    if (model.validationErrors.includes(field)) {
      model.validationErrors.splice(model.validationErrors.indexOf(field), 1);
    }

    return true;
  }

  getTitle(model: BaseModelInterface<unknown> & FieldsInterface<unknown>, field: string): string {
    if (!model || !model.fields[field] || !model.fields[field].title) {
      console.error(
        `The model not contains the '${field}' field's title. You need to set in your model the fields.${field}.title field.`
      );

      return '';
    }

    return model.fields[field].title;
  }

  getLabel(model: BaseModelInterface<unknown> & FieldsInterface<unknown>, field: string): string {
    if (!model || !model.fields[field] || !model.fields[field].label) {
      console.error(
        `The model not contains the '${field}' field's label. You need to set in your model the fields.${field}.label field.`
      );

      return '';
    }

    return model.fields[field].label;
  }

  getPlaceholder(
    model: BaseModelInterface<unknown> & FieldsInterface<unknown>,
    field: string
  ): string {
    if (!model || !model.fields[field] || !model.fields[field].placeholder) {
      console.error(
        `The model not contains the '${field}' field's placeholder. You need to set in your model the fields.${field}.placeholder field.`
      );

      return '';
    }

    return model.fields[field].title;
  }

  getPrepend(model: BaseModelInterface<unknown> & FieldsInterface<unknown>, field: string): string {
    if (!model || !model.fields[field] || !model.fields[field].prepend) {
      return '';
    }

    return model.fields[field].prepend;
  }

  getAppend(model: BaseModelInterface<unknown> & FieldsInterface<unknown>, field: string): string {
    if (!model || !model.fields[field] || !model.fields[field].append) {
      return '';
    }

    return model.fields[field].append;
  }

  isRequired(
    model: BaseModelInterface<unknown> & FieldsInterface<unknown>,
    field: string
  ): boolean {
    return model.validationRules[field].includes('required');
  }

  randChars(): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < 50; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
}
