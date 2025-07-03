
import { Component } from '@angular/core';
import { AddressInterface } from '../address.interface';
import { Address } from '../address.model';
import { CountryInterface } from '../country.interface';
import { DdSelectExampleService } from '../dd-select-example.service';

@Component({
    selector: 'app-dd-select-simple-examples',
    templateUrl: './dd-select-simple-examples.component.html',
    standalone: false
})
export class DdSelectSimpleExamplesComponent {
  address: AddressInterface = new Address();
  countries: CountryInterface[] = [];

  constructor(private readonly service: DdSelectExampleService) {
    this.countries = this.service.getAllCountry();
  }
}
