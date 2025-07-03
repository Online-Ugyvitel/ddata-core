import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DdataChooseSelectedButtonComponentInterface } from './dd-choose-selected-button.component.interface';

// @dynamic
@Component({
    selector: 'dd-choose-selected-button',
    templateUrl: 'dd-choose-selected-button.component.html',
    standalone: false
})
export class DdataChooseSelectedButtonComponent implements DdataChooseSelectedButtonComponentInterface {
  @Input() multipleSelectEnabled = true;
  @Output() choosed: EventEmitter<any> = new EventEmitter();

  chooseSelect(): void {
    this.choosed.emit();
  }
}
