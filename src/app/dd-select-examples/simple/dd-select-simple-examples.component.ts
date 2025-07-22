import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AddressInterface } from '../address.interface';
import { Address } from '../address.model';
import { CountryInterface } from '../country.interface';
import { DdSelectExampleService } from '../dd-select-example.service';

@Component({
  selector: 'app-dd-select-simple-examples',
  templateUrl: './dd-select-simple-examples.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DdSelectSimpleExamplesComponent {
  private readonly service = inject(DdSelectExampleService);

  address: AddressInterface = new Address();
  countries: Array<CountryInterface> = [];

  constructor() {
    this.countries = this.service.getAllCountry();
  }
}
