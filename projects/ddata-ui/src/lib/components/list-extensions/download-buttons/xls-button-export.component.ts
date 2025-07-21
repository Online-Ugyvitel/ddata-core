import { Component, Input } from '@angular/core';
import { BaseModel } from './../../../models/base-model/base-model.model';

@Component({
  selector: 'dd-xls-button-export',
  templateUrl: './xls-button-export.component.html',
  styleUrls: ['./xls-button-export.component.scss'],
  standalone: false
})
export class XlsButtonExportComponent {
  @Input() model: BaseModel = new BaseModel();
  @Input() formats: Array<string> = ['xls', 'csv'];
  token = localStorage.getItem('token') || '';

  constructor() {}

  isXlsEnabled(): boolean {
    return this.formats.includes('xls');
  }

  isCsvEnabled(): boolean {
    return this.formats.includes('csv');
  }

  isPdfEnabled(): boolean {
    return this.formats.includes('pdf');
  }
}
