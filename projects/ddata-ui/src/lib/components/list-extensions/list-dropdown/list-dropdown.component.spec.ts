import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { DialogContentItem } from '@netdjw/ddata-ui-dialog';
import { DdataUiModule } from '../../../ddata-ui.module';
import { ListDropdownComponent } from './list-dropdown.component';

@Component({ template: '', standalone: true })
class DummyDialogComponent {}

describe('ListDropdownComponent', () => {
  let component: ListDropdownComponent;
  let fixture: ComponentFixture<ListDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DdataUiModule],
      providers: [provideRouter([])]
    }).compileComponents();
    fixture = TestBed.createComponent(ListDropdownComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('isVisible() should hide only the explicitly hidden dialog items', () => {
    const createDialogContent = (): DialogContentItem => null;

    expect(component.isVisible({ name: 'Default', createDialogContent })).toBe(true);
    expect(component.isVisible({ name: 'Visible', visible: true, createDialogContent })).toBe(true);
    expect(component.isVisible({ name: 'Hidden', visible: false, createDialogContent })).toBe(
      false
    );
  });

  it('openDialog() should emit the content created by the item', () => {
    const content = new DialogContentItem(DummyDialogComponent, { id: 1 });
    const spy = vi.spyOn(component.showModal, 'emit');

    component.openDialog({ name: 'Create', createDialogContent: () => content });

    expect(spy).toHaveBeenCalledWith(content);
  });

  it('openDialog() should not emit when the item creates no content', () => {
    const spy = vi.spyOn(component.showModal, 'emit');

    component.openDialog({ name: 'Create', createDialogContent: () => null });

    expect(spy).not.toHaveBeenCalled();
  });
});
