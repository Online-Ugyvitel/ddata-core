import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseModelInterface } from '../../models/base/base-model.model';
import { SelectableInterface } from '../../models/selectable/selectable.interface';
import { BaseListComponent } from './base-list.component';
import { SelectableListComponentInterface } from './selectable-list.component.interface';

// @dynamic
@Component({
  template: '',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
// eslint-disable-next-line @typescript-eslint/naming-convention
export abstract class SelectableListComponent<T extends BaseModelInterface<T> & SelectableInterface>
  extends BaseListComponent<T>
  implements SelectableListComponentInterface<T>
{
  @Input() isModal = true;
  @Input() multipleSelectEnabled = true;
  @Input() isSelectionList = true;
  @Input() loadData = false;
  @Input() set selectedElements(value: Array<T>) {
    this.models.map((obj: T) => (obj.is_selected = false));

    value.forEach((item: T) => {
      const selectedModel = this.models.findIndex((obj: T) => obj.id === item.id);

      if (selectedModel !== -1) {
        this.models[selectedModel].is_selected = true;
      }
    });

    this.selectedElementsSet = new Set(!!value.length ? value : []);
  }

  get selectedElements(): Array<T> {
    return Array.from(this.selectedElementsSet);
  }

  @Output() readonly removeSelection: EventEmitter<Array<T>> = new EventEmitter();
  @Output() readonly setSelection: EventEmitter<Array<T>> = new EventEmitter();
  @Output() readonly emitSelected: EventEmitter<Array<T>> = new EventEmitter();

  private selectedElementsSet: Set<T> = new Set([]);
  datasArrived: BehaviorSubject<number> = new BehaviorSubject(0);
  select: BehaviorSubject<Array<T>> = new BehaviorSubject(null);

  toggleSelect(model: T): void {
    const isFound: boolean = this.selectedElementsSet.has(model);

    if (isFound) {
      this.selectedElementsSet.delete(model);
      this.removeSelection.emit(Array.from(this.selectedElementsSet));
    } else {
      this.selectedElementsSet.add(model);
      this.setSelection.emit(Array.from(this.selectedElementsSet));
    }
  }

  chooseSelect(): void {
    this.select.next(Array.from(this.selectedElementsSet));
    this.emitSelected.emit(Array.from(this.selectedElementsSet));
  }
}
