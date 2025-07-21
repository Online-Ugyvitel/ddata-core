// tslint:disable: max-line-length
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Global } from 'src/app/models/global.model';

@Component({
  selector: 'dd-list-dropdown-delete-confirm',
  templateUrl: './list-dropdown-delete-confirm.component.html',
  styleUrls: ['./list-dropdown-delete-confirm.component.scss'],
  standalone: false
})
export class ListDropdownDeleteConfirmComponent implements OnInit {
  @Input() alternateDeleteText = ''; // ha van megadva alternateDeleteText, akkor meg kell adni a service-t is.
  @Input() service: any;
  @Input() model: any;
  @Input() instanceName = 'name';
  @Output() confirm: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
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

  confirmModal() {
    this.confirm.emit(this.model);
    this.isModalVisible = false;
  }

  onCancel() {
    this.cancel.emit();
    this.isModalVisible = false;
  }
}
