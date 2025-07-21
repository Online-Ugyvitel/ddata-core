import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BaseModel, BaseModelInterface } from 'src/app/models/base-model/base-model.model';
import { Global } from 'src/app/models/global.model';

@Component({
  selector: 'dd-list-buttons',
  templateUrl: './list-buttons.component.html',
  styleUrls: ['./list-buttons.component.scss'],
  standalone: false
})
export class ListButtonsComponent implements OnInit {
  /**
   * `BaseModelInterface<any>` - Need to specify a model to set the `api_endpoint`. Default is a `new BaseModel()`.
   */
  @Input() model: BaseModelInterface<any> = new BaseModel();

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
   * `SelectionModel` where you specify the selection of the list. Default `new SelectionModel<BaseModelInterface<any>>`
   * as empty array.
   */
  // tslint:disable-next-line: max-line-length
  @Input() selection: SelectionModel<BaseModelInterface<any>> = new SelectionModel<
    BaseModelInterface<any>
  >(this.multipleSelectEnabled, []);

  /**
   * `EventEmitter<any>` emitting when user click on "Add new" button & `createButtonNavigateToUrl` is false.
   */
  @Output() addNew: EventEmitter<any> = new EventEmitter();

  /**
   * `EventEmitter<any>` emitting when user click on "Get selected" button.
   */
  @Output() emitSelected: EventEmitter<any> = new EventEmitter();

  /**
   * `EventEmitter<any>` emitting when user click on "Delete selected" button.
   */
  @Output() deleteSelected: EventEmitter<any> = new EventEmitter();
  icon = new Global().icon;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {}

  select() {
    this.emitSelected.emit();
  }

  create() {
    if (this.createButtonNavigateToUrl) {
      this.router.navigateByUrl(`${this.model.api_endpoint}/create`);

      return;
    }

    this.addNew.emit();
  }

  delete() {
    this.deleteSelected.emit();
  }
}
