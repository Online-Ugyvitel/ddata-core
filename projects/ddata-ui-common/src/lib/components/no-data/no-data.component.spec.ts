import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DdataUiNoDataComponent } from './no-data.component';

describe('DdataUiNoDataComponent', () => {
  let component: DdataUiNoDataComponent;
  let fixture: ComponentFixture<DdataUiNoDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DdataUiNoDataComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // This allows custom elements like fa-icon
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DdataUiNoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('icons should contain the created component', () => {
    component = new DdataUiNoDataComponent();

    expect(component.icons).toContain(component.randomIcon);
  });
});
