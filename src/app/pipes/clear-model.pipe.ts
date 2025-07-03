import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'clearModel',
    standalone: false
})
export class ClearModelPipe implements PipeTransform {
  removeProperties(model: any): any {
    delete model.api_endpoint;
    delete model.use_localstorage;
    delete model.isValid;
    delete model.validationErrors;
    delete model.validationRules;
    delete model.fields;

    return model;
  }

  transform(model: any, args?: any): any {
    // let model = { ...value };

    model = this.removeProperties(model);

    Object.keys(model).forEach(key => {
      if (model[key] instanceof Object) {
        model[key] = this.removeProperties(model[key]);
      }
    });

    return model;
  }
}
