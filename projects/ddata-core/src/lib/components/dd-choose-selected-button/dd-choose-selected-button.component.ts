import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { DdataChooseSelectedButtonComponentInterface } from './dd-choose-selected-button.component.interface';

// @dynamic
@Component({
  selector: 'dd-choose-selected-button',
  templateUrl: './dd-choose-selected-button.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DdataChooseSelectedButtonComponent
  implements DdataChooseSelectedButtonComponentInterface
{
  @Input() multipleSelectEnabled = true;
  @Output() readonly choosed: EventEmitter<void> = new EventEmitter();

  chooseSelect(): void {
    this.choosed.emit();
  }
}
