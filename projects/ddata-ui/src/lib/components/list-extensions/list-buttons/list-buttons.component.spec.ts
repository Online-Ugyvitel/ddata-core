import { SelectionModel } from '@angular/cdk/collections';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { BaseModel, BaseModelInterface } from '@netdjw/ddata-core';
import { DdataUiModule } from '../../../ddata-ui.module';
import { ListButtonsComponent } from './list-buttons.component';

describe('ListButtonsComponent', () => {
  let component: ListButtonsComponent;
  let fixture: ComponentFixture<ListButtonsComponent>;
  let model: BaseModel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DdataUiModule],
      providers: [provideRouter([])]
    }).compileComponents();
    fixture = TestBed.createComponent(ListButtonsComponent);
    component = fixture.componentInstance;
    model = new BaseModel();
    model.api_endpoint = '/product';
    model.fields = { title: { label: 'Termék', title: 'Termék', placeholder: 'Termék' } };
    component.model = model;
  });

  it('should show the title of the model in the "add new" button', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Új termék');
  });

  it('should keep the case of the title when transformToLowerCase is false', () => {
    component.transformToLowerCase = false;

    expect(component.modelTitle).toBe('Termék');
  });

  it('should not fail without a title field', () => {
    component.model = new BaseModel();

    expect(component.modelTitle).toBe('');
  });

  it('select() should emit the emitSelected event', () => {
    const spy = vi.spyOn(component.emitSelected, 'emit');

    component.select();

    expect(spy).toHaveBeenCalledWith();
  });

  it('create() should navigate to the create page of the model', () => {
    const spy = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    const spyEmit = vi.spyOn(component.addNew, 'emit');

    component.create();

    expect(spy).toHaveBeenCalledWith('/product/create');
    expect(spyEmit).not.toHaveBeenCalled();
  });

  it('create() should emit the addNew event when it does not navigate', () => {
    const spy = vi.spyOn(TestBed.inject(Router), 'navigateByUrl');
    const spyEmit = vi.spyOn(component.addNew, 'emit');

    component.createButtonNavigateToUrl = false;
    component.create();

    expect(spy).not.toHaveBeenCalled();
    expect(spyEmit).toHaveBeenCalledWith();
  });

  it('delete() should emit the deleteSelected event', () => {
    const spy = vi.spyOn(component.deleteSelected, 'emit');

    component.delete();

    expect(spy).toHaveBeenCalledWith();
  });

  it('should hide the "delete selected" button without selection', () => {
    component.selection = new SelectionModel<BaseModelInterface<unknown>>(true, []);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('törlése');
  });

  it('should show the "delete selected" button with selection', () => {
    component.selection = new SelectionModel<BaseModelInterface<unknown>>(true, [model]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Kijelölt törlése');
  });
});
