import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ID } from '@netdjw/ddata-core';
import {
  LangInterface,
  MultilanguageNameInterface,
  NameInterface
} from '../../models/lang/lang.interface';
let nextId = 0;

/**
 * Edits the `names` array of a model: every name has a language and a text.
 * The first name is always visible and can't be deleted, the others can be hidden.
 * Deleting a name needs confirmation, the confirmation is shown inline in the row.
 *
 * The `names` array is never mutated, a new array is set on the model and emitted
 * on `namesChange` after every add and delete.
 */
@Component({
  selector: 'dd-multilanguage-name',
  templateUrl: './multilanguage-name.component.html',
  styleUrls: ['./multilanguage-name.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultilanguageNameComponent {
  @Input() model: MultilanguageNameInterface | null = null;
  @Input() langs: Array<LangInterface> = [];
  @Input() defaultLangId: ID = 1 as ID;
  @Input() placeholder = 'Név';
  @Input() title = 'Név';
  @Input() langLabel = 'Nyelv';
  @Input() addButtonText = 'Új nyelv hozzáadása';
  @Input() hideButtonText = 'Nyelvek elrejtése';
  @Input() showButtonText = 'További elérhető nyelvek száma';
  @Input() deleteButtonText = 'Név törlése';
  @Input() confirmText = 'Biztos törölni szeretné a nevet?';
  @Input() confirmButtonText = 'Törlés';
  @Input() cancelButtonText = 'Mégsem';

  @Output() readonly namesChange: EventEmitter<Array<NameInterface>> = new EventEmitter();

  readonly idPrefix = `dd-multilanguage-name-${nextId++}`;
  readonly icon = { plus: faPlus, trash: faTrash };

  show = true;
  nameToDelete: NameInterface | null = null;

  get names(): Array<NameInterface> {
    return this.model?.names ?? [];
  }

  getId(type: 'lang' | 'name', index: number): string {
    return `${this.idPrefix}_${type}_${index}`;
  }

  addName(): void {
    if (!this.model) {
      return;
    }

    this.setNames([...this.names, { lang_id: this.defaultLangId, name: '' }]);
  }

  deleteName(name: NameInterface | null): void {
    const index = this.names.indexOf(name);

    // the first name can't be deleted
    if (index < 1) {
      return;
    }

    this.setNames(this.names.filter((item) => item !== name));
  }

  confirmDelete(confirmed: boolean): void {
    if (confirmed) {
      this.deleteName(this.nameToDelete);
    }

    this.nameToDelete = null;
  }

  toggle(): void {
    this.show = !this.show;
  }

  getTotal(): number {
    return Math.max(this.names.length - 1, 0);
  }

  private setNames(names: Array<NameInterface>): void {
    this.model.names = names;
    this.namesChange.emit(names);
  }
}
