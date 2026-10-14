import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseModel } from '@netdjw/ddata-core';
import { XlsButtonExportComponent } from './xls-button-export.component';

describe('XlsButtonExportComponent', () => {
  let component: XlsButtonExportComponent;
  let fixture: ComponentFixture<XlsButtonExportComponent>;

  beforeEach(async () => {
    localStorage.setItem('token', 'export-token');
    await TestBed.configureTestingModule({
      declarations: [XlsButtonExportComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(XlsButtonExportComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.removeItem('token');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the XLS and CSV download links by default', () => {
    const model = new BaseModel();

    model.api_endpoint = '/product';
    fixture.componentRef.setInput('model', model);
    fixture.detectChanges();
    const links: Array<HTMLAnchorElement> = Array.from(fixture.nativeElement.querySelectorAll('a'));

    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/api/product/download/xls?token=export-token',
      '/api/product/download/csv?token=export-token'
    ]);
  });

  it('should show only the requested formats', () => {
    component.formats = ['pdf'];

    expect(component.isXlsEnabled()).toBe(false);
    expect(component.isCsvEnabled()).toBe(false);
    expect(component.isPdfEnabled()).toBe(true);
  });
});
