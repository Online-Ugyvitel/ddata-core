import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdataUiPaginateComponent } from './paginate.component';

xdescribe('DdataUiPaginateComponent', () => {
  let component: DdataUiPaginateComponent;
  let fixture: ComponentFixture<DdataUiPaginateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DdataUiPaginateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataUiPaginateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
