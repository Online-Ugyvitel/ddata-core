import { EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HelperServiceInterface } from '../../../services/helper/helper-service.interface';
import { ID } from '../../../models/base/base-data.type';
import { TestModelInterface } from './test-model.interface';
import { TestModel } from './test-model.class';
import { mockPaginateWithData } from './mock-paginate.data';

// Mock HelperService
export class MockHelperService implements HelperServiceInterface<TestModelInterface> {
  booleanChange(model: TestModelInterface, fieldName: string) {
    return of(true);
  }

  save(model: TestModelInterface, isModal: boolean, emitter: EventEmitter<TestModelInterface>, saveBackend?: boolean, navigateAfterSuccess?: string) {
    if (isModal && !saveBackend) {
      emitter.emit(model);
    }
    return of(true);
  }

  saveAsNew(model: TestModelInterface) {
    model.id = 0 as ID;
    return of(true);
  }

  edit(model: TestModelInterface, reference: any): void {
    if (reference && reference.editModel) {
      reference.editModel.emit(model);
    }
  }

  delete(model: TestModelInterface, reference: any) {
    if (reference && reference.deleteModel) {
      reference.deleteModel.emit(model);
    }
    return of(true);
  }

  deleteMultiple(models: TestModelInterface[], reference: any) {
    if (reference && reference.deleteMultipleModels) {
      reference.deleteMultipleModels.emit(models);
    }
    return of(true);
  }

  stepBack(model: TestModelInterface, isModal: boolean, emitter: EventEmitter<TestModelInterface>): void {
    if (isModal) {
      emitter.emit(null);
    }
  }

  changeToPage(turnToPage: number, paginate: any, models: TestModelInterface[]) {
    return of(true);
  }

  getOne(model: TestModelInterface, isModal: boolean, handleLoader?: boolean) {
    return of(true);
  }

  getAll(paginate: any, models: TestModelInterface[], isModal?: boolean, pageNumber?: number) {
    return of(mockPaginateWithData);
  }

  search(data: any, pageNumber?: number) {
    return of(mockPaginateWithData);
  }

  searchWithoutPaginate(data: any) {
    return of([]);
  }
}