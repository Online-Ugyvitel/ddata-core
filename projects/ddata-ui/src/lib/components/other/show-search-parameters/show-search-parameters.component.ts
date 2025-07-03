import { Component, Input, OnInit } from '@angular/core';
import { FieldContainerInterface } from 'src/app/models/base-model/base-model.model';
import { LangInterface } from 'src/app/models/lang/lang.interface';
import { Lang } from 'src/app/models/lang/lang.model';
import { NameInterface } from 'src/app/models/name/name.interface';

interface HasFieldContainerInterface {
  fields: FieldContainerInterface<any>;
}

@Component({
    selector: 'app-show-search-parameters',
    templateUrl: './show-search-parameters.component.html',
    styleUrls: ['./show-search-parameters.component.scss'],
    standalone: false
})
export class ShowSearchParametersComponent implements OnInit {
  @Input() langs: LangInterface[] = [];
  @Input() set model(value: HasFieldContainerInterface) {
    this._model = value;
  }
  _model: HasFieldContainerInterface = {fields: {}};
  datas: {name: string, value: string}[] = [];

  constructor() { }

  ngOnInit(): void {
    this.getFields();
  }

  getFields() {
    this.datas = [];
    const skippedFields = [
      'typeSettingSumma',
    ];

    Object.keys(this._model.fields).map((key: string) => {
      // disabled fields
      if (skippedFields.includes(key)) {
        return;
      }

      // null value or empty string
      if (this._model[key] === null || this._model[key] === '') {
        return;
      }

      // empty array
      if (this._model[key] instanceof Array && this._model[key].length === 0) {
        return;
      }

      // '0' number values from _id ended fields - select-box handling
      const id_regexp = new RegExp(/(.*?)_id$/);
      if (id_regexp.test(key)) {
        if (Number(this._model[key]) === 0) {
          return;
        }

        const model_key = key.replace(id_regexp, '$1');

        if (!!this._model[model_key]) {
          this.datas.push({
            name: this._model.fields[key].label,
            value: this._model[model_key].name,
          });
        }

        return;
      }

      // multilanguage names
      if (key === 'names' && !!this._model[key]) {
        this._model[key].forEach((name: NameInterface) => {
          if (!name.name) {
            return;
          }

          let lang = this.langs.find(_lang => _lang.id === name.lang_id);
          if (!lang) {
            lang = new Lang().init();
          }

          this.datas.push({
            name: this._model.fields[key].label,
            value: '(' + lang.name + ') ' + name.name,
          });

        });

        return;
      }

      if (!!this._model[key]) {
        this.datas.push({
          name: this._model.fields[key].label,
          value: this._model[key],
        });
      }
    });

  }

}
