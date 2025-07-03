
import { Component } from '@angular/core';
import { DialogContentWithOptionsInterface } from 'projects/ddata-ui-input/src/public-api';
import { AddressInterface } from '../address.interface';
import { Address } from '../address.model';
import { DdSelectExampleService } from '../dd-select-example.service';
import { TagListComponent } from '../tag-list/tag-list.component';
import { TagInterface } from '../tag.interface';

@Component({
    selector: 'app-dd-select-multiple-basic-examples',
    templateUrl: './dd-select-multiple-basic-examples.component.html',
    standalone: false
})
export class DdSelectMultipleBasicExamplesComponent {
  address: AddressInterface = new Address();
  tags: TagInterface[] = [];
  dialogSettings: DialogContentWithOptionsInterface;

  constructor(private readonly service: DdSelectExampleService) {
    this.tags = this.service.getAllTags();

    this.dialogSettings = {
      createEditComponent: undefined,

      listComponent: TagListComponent,
      listOptions: {
        isModal: true,
        multipleSelectEnabled: true,
        isSelectionList: true,
        models: this.tags,
        loadData: false,
      }
    };
  }
}
