import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ListDropdownDeleteConfirmComponent } from './list-dropdown-delete-confirm.component';

xdescribe('ListDropdownDeleteConfirmComponent', () => {
  let component: ListDropdownDeleteConfirmComponent;
  let fixture: ComponentFixture<ListDropdownDeleteConfirmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDropdownDeleteConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDropdownDeleteConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
