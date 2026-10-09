import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XlsButtonExportComponent } from './xls-button-export.component';

describe('XlsButtonExportComponent', () => {
  let component: XlsButtonExportComponent;
  let fixture: ComponentFixture<XlsButtonExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XlsButtonExportComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XlsButtonExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
