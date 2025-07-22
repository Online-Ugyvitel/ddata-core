import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { BaseModel, BaseModelInterface } from 'ddata-core';
import { Global } from '../../../models/global.model';

@Component({
  selector: 'dd-list-buttons',
  templateUrl: './list-buttons.component.html',
  styleUrls: ['./list-buttons.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListButtonsComponent {
  /**
   * `BaseModelInterface<unknown>` - Need to specify a model to set the `api_endpoint`. Default is a `new BaseModel()`.
   */
  @Input() model: BaseModelInterface<unknown> = new BaseModel();

  /**
   * `boolean` - Define this is a list where the user can select elements. Default `false`.
   */
  @Input() isSelectionList = false;

  /**
   * `boolean` - "Add new" button is visible or not. Default `true`.
   */
  @Input() showAddButton = true;

  /**
   * `boolean` - "Download XLS" & "Download CSV" button is visible or not. Default `true`.
   */
  @Input() showDownloadButtons = true;

  /**
   * `boolean` - "Delete selected" button is visible or not. Default `false`.
   */
  @Input() showDeleteSelectedButton = false;

  /**
   * `boolean` - Multiple selection is enabled or not. Default `true`.
   */
  @Input() multipleSelectEnabled = true;

  /**
   * `boolean` - Transform title to lower case or not. Default `true`.
   */
  @Input() transformToLowerCase = true;

  /**
   * `boolean` - "Add new" button navigate to `/create` URI. If `false`, `addNew` emitting. Default `true`.
   */
  @Input() createButtonNavigateToUrl = true;

  /**
   * `SelectionModel` where you specify the selection of the list. Default `new SelectionModel<BaseModelInterface<unknown>>`
   * as empty array.
   */
  // tslint:disable-next-line: max-line-length
  @Input() selection: SelectionModel<BaseModelInterface<unknown>> = new SelectionModel<
    BaseModelInterface<unknown>
  >(this.multipleSelectEnabled, []);

  /**
   * `EventEmitter<void>` emitting when user click on "Add new" button & `createButtonNavigateToUrl` is false.
   */
  @Output() readonly addNew: EventEmitter<void> = new EventEmitter();

  /**
   * `EventEmitter<void>` emitting when user click on "Get selected" button.
   */
  @Output() readonly emitSelected: EventEmitter<void> = new EventEmitter();

  /**
   * `EventEmitter<void>` emitting when user click on "Delete selected" button.
   */
  @Output() readonly deleteSelected: EventEmitter<void> = new EventEmitter();
  icon = new Global().icon;

  constructor(private readonly router: Router) {}

  select(): void {
    this.emitSelected.emit();
  }

  create(): void {
    if (this.createButtonNavigateToUrl) {
      this.router.navigateByUrl(`${this.model.api_endpoint}/create`);

      return;
    }

    this.addNew.emit();
  }

  delete(): void {
    this.deleteSelected.emit();
  }
}
