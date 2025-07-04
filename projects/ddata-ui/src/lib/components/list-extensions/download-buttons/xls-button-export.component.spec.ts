import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { XlsButtonExportComponent } from './xls-button-export.component';

xdescribe('XlsButtonExportComponent', () => {
  let component: XlsButtonExportComponent;
  let fixture: ComponentFixture<XlsButtonExportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ XlsButtonExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XlsButtonExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
