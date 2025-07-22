import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { SelectableListComponent } from '../../../../projects/ddata-core/src/public-api';
import { CountryInterface } from '../country.interface';
import { Country } from '../country.model';
import { DdSelectExampleService } from '../dd-select-example.service';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  standalone: true,
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
      this._selectedElements.clear();

      this.models
        .filter((_) => _.id !== model.id)
        .forEach((_) => {
          _.is_selected = false;
          this._selectedElements.delete(_);
        });
    }

    model.is_selected = !model.is_selected;

    if (model.is_selected) {
      this._selectedElements.add(model);
    } else {
      this._selectedElements.delete(model);
    }

    this.changeDetector.detectChanges();
  }
}
