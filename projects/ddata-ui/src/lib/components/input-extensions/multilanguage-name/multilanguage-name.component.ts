import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ID } from '@netdjw/ddata-core';
import { Global } from '../../../models/global.model';
import {
  LangInterface,
  MultilanguageNameInterface,
  NameInterface
} from '../../../models/lang/lang.interface';

@Component({
  selector: 'dd-multilanguage-name',
  templateUrl: './multilanguage-name.component.html',
  styleUrls: ['./multilanguage-name.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultilanguageNameComponent {
  @Input() model: MultilanguageNameInterface;
  @Input() langs: Array<LangInterface> = [];
  @Input() defaultLangId: ID = 1 as ID;
  @Input() placeholder = 'Név';
  @Input() title = 'Név';

  show = true;
  nameToDelete: NameInterface = null;
  icon = new Global().icon;

  addName(): void {
    this.model.names.push({ lang_id: this.defaultLangId, name: '' });
  }

  deleteName(name: NameInterface): void {
    const index = this.model.names.indexOf(name);

    if (index !== -1) {
      this.model.names.splice(index, 1);
    }
  }

  confirmDelete(confirmed: boolean): void {
    if (confirmed) {
      this.deleteName(this.nameToDelete);
    }

    this.nameToDelete = null;
  }

  getTotal(): number {
    return this.model.names.length - 1;
  }
}
