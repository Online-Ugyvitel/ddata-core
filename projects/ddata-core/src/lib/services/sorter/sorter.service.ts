import { Injectable } from '@angular/core';
import { SorterServiceInterface } from './sorter-service.interface';

@Injectable({
  providedIn: 'root'
})
export class SorterService<T> implements SorterServiceInterface<T> {
  sortBy(objects: Array<T>, key: string): Array<T> {
    if (objects instanceof Array === false) {
      return [];
    }

    objects.sort((a: T, b: T) =>
      !!a[key] ? a[key].toString().localeCompare(b[key].toString(), 'hu', { numeric: true }) : 0
    );

    return objects;
  }

  sortByDesc(objects: Array<T>, key: string): Array<T> {
    return this.sortBy(objects, key).reverse();
  }
}
