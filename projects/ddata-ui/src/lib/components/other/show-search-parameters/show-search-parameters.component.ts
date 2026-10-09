import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FieldContainerInterface } from 'ddata-core';
import { LangInterface } from 'src/app/models/lang/lang.interface';
import { Lang } from 'src/app/models/lang/lang.model';
import { NameInterface } from 'src/app/models/name/name.interface';

interface HasFieldContainerInterface {
  fields: FieldContainerInterface<unknown>;
}

@Component({
  selector: 'dd-show-search-parameters',
  templateUrl: './show-search-parameters.component.html',
  styleUrls: ['./show-search-parameters.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowSearchParametersComponent implements OnInit {
  @Input() langs: Array<LangInterface> = [];

  private internalModel: HasFieldContainerInterface = { fields: {} };
  @Input() set model(value: HasFieldContainerInterface) {
    this.internalModel = value;
  }

  datas: Array<{ name: string; value: string }> = [];

  constructor() {}

  ngOnInit(): void {
    this.getFields();
  }

  getFields(): void {
    this.datas = [];
    const skippedFields = ['typeSettingSumma'];

    Object.keys(this.internalModel.fields).map((key: string) => {
      // disabled fields
      if (skippedFields.includes(key)) {
        return;
      }

      // null value or empty string
      if (this.internalModel[key] === null || this.internalModel[key] === '') {
        return;
      }

      // empty array
      if (this.internalModel[key] instanceof Array && this.internalModel[key].length === 0) {
        return;
      }
      // '0' number values from _id ended fields - select-box handling
      const idRegexp = new RegExp(/(.*?)_id$/);

      if (idRegexp.test(key)) {
        if (Number(this.internalModel[key]) === 0) {
          return;
        }
        const modelKey = key.replace(idRegexp, '$1');

        if (!!this.internalModel[modelKey]) {
          this.datas.push({
            name: this.internalModel.fields[key].label,
            value: this.internalModel[modelKey].name
          });
        }

        return;
      }

      // multilanguage names
      if (key === 'names' && !!this.internalModel[key]) {
        this.internalModel[key].forEach((name: NameInterface) => {
          if (!name.name) {
            return;
          }
          let language = this.langs.find((langVariable) => langVariable.id === name.lang_id);

          if (!language) {
            language = new Lang().init();
          }

          this.datas.push({
            name: this.internalModel.fields[key].label,
            value: `(${language.name}) ${name.name}`
          });
        });

        return;
      }

      if (!!this.internalModel[key]) {
        this.datas.push({
          name: this.internalModel.fields[key].label,
          value: this.internalModel[key]
        });
      }
    });
  }
}
