import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DialogContentWithOptionsInterface } from 'projects/ddata-ui-input/src/public-api';
import { AddressInterface } from '../address.interface';
import { Address } from '../address.model';
import { CountryListComponent } from '../country-list/country-list.component';
import { DdSelectExampleService } from '../dd-select-example.service';
import { TagListComponent } from '../tag-list/tag-list.component';

@Component({
  selector: 'app-dd-select-single-examples',
  templateUrl: './dd-select-single-examples.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DdSelectSingleExamplesComponent {
  private readonly service = inject(DdSelectExampleService);

  address1: AddressInterface = new Address();
  address2: AddressInterface = new Address();
  address3: AddressInterface = new Address();
  countryDialogSettings: DialogContentWithOptionsInterface;
  tagDialogSettings2: DialogContentWithOptionsInterface;
  tagDialogSettings3: DialogContentWithOptionsInterface;

  constructor() {
    this.countryDialogSettings = {
      createEditComponent: undefined,

      listComponent: CountryListComponent,
      listOptions: {
        isModal: true,
        multipleSelectEnabled: false,
        isSelectionList: true,
        models: [this.address1.country],
        loadData: true
      }
    };

    this.tagDialogSettings2 = {
      createEditComponent: undefined,

      listComponent: TagListComponent,
      listOptions: {
        isModal: true,
        multipleSelectEnabled: false,
        isSelectionList: true,
        loadData: false
      }
    };
    const tags = this.service.getAllTags();
    const random = Math.floor(Math.random() * tags.length);

    this.address3.tag = tags[random];
    this.address3.tag_id = this.address3.tag.id;
    this.address3.tag.is_selected = true;

    this.tagDialogSettings3 = {
      createEditComponent: undefined,

      listComponent: TagListComponent,
      listOptions: {
        isModal: true,
        multipleSelectEnabled: false,
        isSelectionList: true,
        selectedElements: [this.address3.tag],
        loadData: false
      }
    };
  }

  log(event: unknown, type: string): void {
    // Event logging removed for production - can be re-enabled for debugging
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unused = { event, type };
  }
}
