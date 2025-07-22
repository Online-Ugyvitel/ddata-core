// tslint:disable: max-line-length
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy
} from '@angular/core';
import { Global } from '../../../../models/global.model';

@Component({
  selector: 'dd-list-dropdown-delete-confirm',
  templateUrl: './list-dropdown-delete-confirm.component.html',
  styleUrls: ['./list-dropdown-delete-confirm.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListDropdownDeleteConfirmComponent implements OnInit {
  @Input() alternateDeleteText = ''; // ha van megadva alternateDeleteText, akkor meg kell adni a service-t is.
  @Input() service: {
    isInUse: (id: unknown) => { subscribe: (callback: (result: number) => void) => void };
  };

  @Input() model: {
    id?: unknown;
    names?: Array<{ name: string }>;
    [key: string]: unknown;
  };

  @Input() instanceName = 'name';
  @Output() readonly confirm: EventEmitter<unknown> = new EventEmitter();
  @Output() readonly cancelEvent: EventEmitter<unknown> = new EventEmitter();
  isModalVisible = false;
  deleteText: string;
  icon = new Global().icon;

  constructor() {}

  ngOnInit(): void {
    this.deleteText = 'Biztos törölni szeretné ezt: ';
    this.deleteText +=
      this.instanceName === 'multilanguagename'
        ? `${this.model.names[0].name}?`
        : `${this.model[this.instanceName]}?`;

    if (this.alternateDeleteText.length > 0) {
      this.service.isInUse(this.model.id).subscribe((result) => {
        if (result > 0) {
          this.deleteText = this.alternateDeleteText;
        }

        this.isModalVisible = true;
      });
    } else {
      this.isModalVisible = true;
    }
  }

  confirmModal(): void {
    this.confirm.emit(this.model);
    this.isModalVisible = false;
  }

  onCancel(): void {
    this.cancelEvent.emit();
    this.isModalVisible = false;
  }
}
