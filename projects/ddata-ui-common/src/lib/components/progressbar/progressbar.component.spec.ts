import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DdataUiProgressbarComponent } from './progressbar.component';

describe('DdataUiProgressbarComponent', () => {
  let component: DdataUiProgressbarComponent;
  let fixture: ComponentFixture<DdataUiProgressbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DdataUiProgressbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataUiProgressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
