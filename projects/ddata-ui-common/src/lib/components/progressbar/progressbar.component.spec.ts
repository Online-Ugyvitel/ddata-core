import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DdataUiProgressbarComponent } from './progressbar.component';

xdescribe('DdataUiProgressbarComponent', () => {
  let component: DdataUiProgressbarComponent;
  let fixture: ComponentFixture<DdataUiProgressbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DdataUiProgressbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataUiProgressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
