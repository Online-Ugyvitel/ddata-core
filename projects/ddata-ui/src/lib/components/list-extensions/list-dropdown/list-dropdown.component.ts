import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { DialogContentItem } from '@netdjw/ddata-ui-dialog';
import { Global } from '../../../models/global.model';
import {
  ListDropdownDialogItemInterface,
  ListDropdownItemInterface
} from '../../../models/list-dropdown/list-dropdown-item.interface';

@Component({
  selector: 'dd-list-dropdown',
  templateUrl: './list-dropdown.component.html',
  styleUrls: ['./list-dropdown.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListDropdownComponent {
  @Input() customDropdownItems: Array<ListDropdownItemInterface> = [];
  @Input() dialogItems: Array<ListDropdownDialogItemInterface> = [];
  @Input() showDelete = true;
  @Input() editLink = '';
  @Input() showHref = false;
  @Input() href = '';
  @Input() hrefText = '';
  @Output() readonly showModal: EventEmitter<DialogContentItem> = new EventEmitter();
  @Output() readonly customDropdownEvent: EventEmitter<string> = new EventEmitter();

  icon = new Global().icon;

  isVisible(item: ListDropdownDialogItemInterface): boolean {
    return item.visible !== false;
  }

  openDialog(item: ListDropdownDialogItemInterface): void {
    const content = item.createDialogContent();

    if (!!content) {
      this.showModal.emit(content);
    }
  }
}
