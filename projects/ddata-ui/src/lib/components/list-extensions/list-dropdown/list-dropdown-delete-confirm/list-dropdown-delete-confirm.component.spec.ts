import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject } from 'rxjs';
import { ListDropdownDeleteConfirmComponent } from './list-dropdown-delete-confirm.component';

describe('ListDropdownDeleteConfirmComponent', () => {
  let component: ListDropdownDeleteConfirmComponent;
  let fixture: ComponentFixture<ListDropdownDeleteConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListDropdownDeleteConfirmComponent],
      imports: [FontAwesomeModule]
    }).compileComponents();
    fixture = TestBed.createComponent(ListDropdownDeleteConfirmComponent);
    component = fixture.componentInstance;
  });

  it('should ask to delete the model by its name', () => {
    component.model = { id: 1, name: 'Sample' };
    fixture.detectChanges();

    expect(component.deleteText).toBe('Biztos törölni szeretné ezt: Sample?');
    expect(component.isModalVisible).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Sample?');
  });

  it('should use the first name of a multilanguage model', () => {
    component.model = { id: 1, names: [{ name: 'Első' }, { name: 'First' }] };
    component.instanceName = 'multilanguagename';
    fixture.detectChanges();

    expect(component.deleteText).toBe('Biztos törölni szeretné ezt: Első?');
  });

  it('should show the alternate text when the model is in use', () => {
    const isInUse = new Subject<number>();
    const service = { isInUse: vi.fn().mockReturnValue(isInUse) };

    component.model = { id: 5, name: 'Sample' };
    component.alternateDeleteText = 'It is in use, delete anyway?';
    component.service = service;
    fixture.detectChanges();

    expect(service.isInUse).toHaveBeenCalledWith(5);
    expect(component.isModalVisible).toBe(false);

    isInUse.next(2);

    expect(component.deleteText).toBe('It is in use, delete anyway?');
    expect(component.isModalVisible).toBe(true);
  });

  it('should keep the default text when the model is not in use', () => {
    const isInUse = new Subject<number>();

    component.model = { id: 5, name: 'Sample' };
    component.alternateDeleteText = 'It is in use, delete anyway?';
    component.service = { isInUse: () => isInUse };
    fixture.detectChanges();
    isInUse.next(0);

    expect(component.deleteText).toBe('Biztos törölni szeretné ezt: Sample?');
    expect(component.isModalVisible).toBe(true);
  });

  it('confirmModal() should emit the model and close the dialog', () => {
    const model = { id: 1, name: 'Sample' };
    const confirm = vi.fn();

    component.model = model;
    component.confirm.subscribe(confirm);
    fixture.detectChanges();

    component.confirmModal();

    expect(confirm).toHaveBeenCalledWith(model);
    expect(component.isModalVisible).toBe(false);
  });

  it('onCancel() should emit the cancel event and close the dialog', () => {
    const cancel = vi.fn();

    component.model = { id: 1, name: 'Sample' };
    component.cancelEvent.subscribe(cancel);
    fixture.detectChanges();

    component.onCancel();

    expect(cancel).toHaveBeenCalledTimes(1);
    expect(component.isModalVisible).toBe(false);
  });
});
