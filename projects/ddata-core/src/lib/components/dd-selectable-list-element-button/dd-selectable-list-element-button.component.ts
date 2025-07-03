import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectableInterface } from '../../models/selectable/selectable.interface';
import { Selectable } from '../../models/selectable/selectable.model';
import { DdataSelectableListElementButtonComponentInterface } from './dd-selectable-list-element-button.component.interface';

// @dynamic
@Component({
    selector: 'dd-selectable-list-element-button',
    templateUrl: 'dd-selectable-list-element-button.component.html',
    standalone: false
})
export class DdataSelectableListElementButtonComponent implements DdataSelectableListElementButtonComponentInterface {
  @Input() model: SelectableInterface = new Selectable();

  @Output() choosed: EventEmitter<any> = new EventEmitter();

  chooseSelect(model: SelectableInterface): void {
    this.choosed.emit(model);
  }
}
