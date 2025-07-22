/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { StorageServiceInterface } from './storage-service.interface';

@Injectable({
  providedIn: 'root'
})
export class StorageService implements StorageServiceInterface {
  private readonly storageSub = new Subject<boolean>();

  constructor() {}

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(key: string, data: any): void {
    localStorage.setItem(key, data);
    this.storageSub.next(true);
  }

  removeItem(key: any): void {
    localStorage.removeItem(key);
    this.storageSub.next(true);
  }

  clear(): void {
    localStorage.clear();
    this.storageSub.next(true);
  }
}
