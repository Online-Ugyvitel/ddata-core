/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'clearModel',
  standalone: false
})
export class ClearModelPipe implements PipeTransform {
  removeProperties(model: any): any {
    const cleanedModel = { ...model };

    delete cleanedModel.api_endpoint;
    delete cleanedModel.use_localstorage;
    delete cleanedModel.isValid;
    delete cleanedModel.validationErrors;
    delete cleanedModel.validationRules;
    delete cleanedModel.fields;

    return cleanedModel;
  }

  transform(model: any): any {
    const cleanedModel = this.removeProperties(model);

    Object.keys(cleanedModel).forEach((key) => {
      if (cleanedModel[key] instanceof Object && cleanedModel[key] !== null) {
        cleanedModel[key] = this.removeProperties(cleanedModel[key]);
      }
    });

    return cleanedModel;
  }
}
