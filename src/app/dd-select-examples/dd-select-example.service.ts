import { Injectable } from '@angular/core';
import { CountryInterface } from './country.interface';
import { countries } from './country.mock-data';
import { Country } from './country.model';
import { TagInterface } from './tag.interface';
import { tags } from './tag.mock-data';
import { Tag } from './tag.model';

@Injectable({ providedIn: 'root' })
export class DdSelectExampleService {
  getAllCountry(): Array<CountryInterface> {
    const countryList: Array<CountryInterface> = [];
    const rawCountries = countries;

    rawCountries.forEach((rawData) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      countryList.push(new Country().init({ ...rawData, id: rawData.id as any }));
    });

    return countryList;
  }

  getAllTags(): Array<TagInterface> {
    const tagList: Array<TagInterface> = [];
    const rawTags = tags;

    rawTags.forEach((rawData) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tagList.push(new Tag().init({ ...rawData, id: rawData.id as any }));
    });

    return tagList;
  }
}
