import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PaginateInterface } from 'ddata-core';
import { Subject } from 'rxjs';

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
    // Mock the required input property
    const mockPaginateSubject = new Subject<PaginateInterface>();

    component.paginate = mockPaginateSubject;

    // Emit a sample paginate response
    setTimeout(() => {
      mockPaginateSubject.next({
        current_page: 1,
        last_page: 5,
        total: 100,
        per_page: 20,
        data: []
      } as PaginateInterface);
    }, 0);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
