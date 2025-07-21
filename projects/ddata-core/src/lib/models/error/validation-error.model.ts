import { ValidationErrorSettingsInterface } from './validation-error-settings.model';

export interface ValidationErrorInterface extends Error {
  name: string;
  message: string;
  invalids: Array<string>;
  status: number;
  originalError: any;
}

export class ValidationError extends Error implements ValidationErrorInterface {
  readonly name = 'ValidationError';
  readonly status = 480; // Custom error code: Validation Error on client side
  message: string;
  invalids: Array<string> = [];
  originalError = {
    status: this.status,
    error: {
      name: this.name,
      message: this.message,
      invalids: this.invalids,
      trace: []
    }
  };

  constructor(settings: ValidationErrorSettingsInterface) {
    super(settings.message);

    settings = !!settings ? settings : {};

    this.message = !!settings.message ? settings.message : this.message;
    this.invalids = !!settings.invalids ? settings.invalids : this.invalids;
    this.originalError.error.invalids = this.invalids;

    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
