import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { SelectableListComponent } from '../../../../projects/ddata-core/src/public-api';
import { CountryInterface } from '../country.interface';
import { Country } from '../country.model';
import { DdSelectExampleService } from '../dd-select-example.service';

@Component({
  selector: 'dd-country-list',
  templateUrl: './country-list.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryListComponent extends SelectableListComponent<CountryInterface> {
  private readonly service = inject(DdSelectExampleService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  models: Array<CountryInterface> = [];

  constructor() {
    super(Country);
    this.models = this.service.getAllCountry();
  }

  load(): void {}

  selected(model: CountryInterface): void {
    if (!this.multipleSelectEnabled) {
      // Clear all selections
      this.selectedElements = [];

      this.models
        .filter((_) => _.id !== model.id)
        .forEach((_) => {
          _.is_selected = false;
        });
    }

    model.is_selected = !model.is_selected;

    if (model.is_selected) {
      // Add to selection
      const currentSelection = this.selectedElements;

      currentSelection.push(model);
      this.selectedElements = currentSelection;
    } else {
      // Remove from selection
      const currentSelection = this.selectedElements.filter((_) => _.id !== model.id);

      this.selectedElements = currentSelection;
    }

    this.changeDetector.detectChanges();
  }
}
