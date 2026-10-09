import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PaginateInterface } from 'ddata-core';

import { DdataUiPaginateComponent } from './paginate.component';

describe('DdataUiPaginateComponent', () => {
  let component: DdataUiPaginateComponent;
  let fixture: ComponentFixture<DdataUiPaginateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DdataUiPaginateComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataUiPaginateComponent);
    component = fixture.componentInstance;
    component.paginate = {
      current_page: 1,
      last_page: 5,
      total: 100,
      per_page: 20,
      data: []
    } as unknown as PaginateInterface;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
