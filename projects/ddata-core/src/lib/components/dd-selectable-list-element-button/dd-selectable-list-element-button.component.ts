import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { SelectableInterface } from '../../models/selectable/selectable.interface';
import { Selectable } from '../../models/selectable/selectable.model';
import { DdataSelectableListElementButtonComponentInterface } from './dd-selectable-list-element-button.component.interface';

// @dynamic
@Component({
  selector: 'dd-selectable-list-element-button',
  templateUrl: './dd-selectable-list-element-button.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DdataSelectableListElementButtonComponent
  implements DdataSelectableListElementButtonComponentInterface
{
  @Input() model: SelectableInterface = new Selectable();

  @Output() readonly choosed: EventEmitter<SelectableInterface> = new EventEmitter();

  chooseSelect(model: SelectableInterface): void {
    this.choosed.emit(model);
  }
}
