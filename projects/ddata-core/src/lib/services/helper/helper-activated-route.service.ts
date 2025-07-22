import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperActivatedRouteService {
  /**
   * Return object what contains the `id` from the current URL as Observable<Params>
   *
   * Returned object in the `Observable` will looks like this (if the ID in the URL is `42`):
   *
   * ```json
   * {
   *   id: 42
   * }
   * ```
   */
  params(): Observable<Params> {
    const params: Observable<Params> = of({
      id: this.getId()
    });

    return params;
  }

  /**
   * Return the id from the URL if the URL looks like this:
   *
   * @example (.*?)/edit/:id
   * @example (.*?)/list/:id
   *
   * @returns id number
   */
  getId(): number {
    let id = 0;
    const url = window.location.href;
    const urlParts = url.split('/');
    const itemsNumber = urlParts.length - 1;
    const regex = new RegExp(/^\d+$/);

    if (
      (urlParts[itemsNumber - 1] === 'edit' || urlParts[itemsNumber - 1] === 'list') &&
      regex.test(urlParts[itemsNumber])
    ) {
      id = Number(urlParts[itemsNumber]);
    }

    return id;
  }

  /**
   * Sándor Dániel> Azért hoztam létre külön egy functiont, mert
   * 1. a getId() editelést is figyelembe veszi, így edit után is a list/editID-re ugrik
   *
   * 2. Ha kivszem, hogy figyelje az editet, akkor nem fogja figyelni a params() lévő idt, és nem tölti be az adatokat.
   *
   * 3. Mivel tudnia kell, hogy melyik list/:id térjen vissza, így paraméterben kell szerepelni az id-nek (app routeban
   * módosítottam) és ha a getId()-ben egészítem ki a vizsgálatot a sajátommal, akkor minden esetben, ha a paraméterben
   * szerepel id, akkor az edit töltődik be. (a params() függvény több helyen használva van, nem akartam birizgálni, ezért
   * hoztam létre egy egyedit erre az esetre)
   *
   */
  getUniqueListId(): number {
    let id = 0;
    const url = window.location.href;
    const urlParts = url.split('/');
    const regex = new RegExp(/^\d+$/);
    const isUrlIncludeList = urlParts.includes('list');

    if (isUrlIncludeList) {
      const itemsNumber = urlParts.indexOf('list');

      if (urlParts[itemsNumber] === 'list' && regex.test(urlParts[itemsNumber + 1])) {
        id = Number(urlParts[itemsNumber + 1]);
      }
    }

    return id;
  }

  /**
   * Bablena Ferend> A getUniquListId() kicsit módosított változata
   * a webshop/product/details/:id-nél derült ki, hogy ott külön kell megadni, mi az url vége
   *
   * @param lastWord az id előtt szereplő utolsó egyedi tagot kell megadni
   */
  getUniqueId(lastWord: string): number {
    let id = 0;
    const url = window.location.href;
    const urlParts = url.split('/');
    const regex = new RegExp(/^\d+$/);
    const isUrlIncludeList = urlParts.includes(lastWord);

    if (isUrlIncludeList) {
      const itemsNumber = urlParts.indexOf(lastWord);

      if (urlParts[itemsNumber] === lastWord && regex.test(urlParts[itemsNumber + 1])) {
        id = Number(urlParts[itemsNumber + 1]);
      }
    }

    return id;
  }
}
