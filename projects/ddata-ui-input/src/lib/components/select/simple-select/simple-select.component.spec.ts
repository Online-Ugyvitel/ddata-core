import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { DdataSimpleSelectComponent } from './simple-select.component';
import { DdataCoreModule, BaseModelInterface, FieldsInterface } from '@netdjw/ddata-core';
import { InputHelperService } from '../../../services/input/helper/input-helper.service';

type MockModel = BaseModelInterface<unknown> & FieldsInterface<unknown>;

describe('DdataSimpleSelectComponent', () => {
  let component: DdataSimpleSelectComponent;
  let fixture: ComponentFixture<DdataSimpleSelectComponent>;
  // Mock objects for testing
  const mockCountry1 = { id: 1, name: 'United States' };
  const mockCountry2 = { id: 2, name: 'Canada' };
  const mockCountry3 = { id: 3, name: 'Mexico' };
  const mockCountries = [mockCountry1, mockCountry2, mockCountry3];
  const mockModel = {
    country_id: 2,
    validationErrors: []
  } as unknown as MockModel;

  beforeEach(async () => {
    let callCount = 0;
    // Mock DdataCoreModule.InjectorInstance to prevent runtime errors
    const mockInjector = {
      get: vi
        .fn()
        .mockName('get')
        .mockReturnValue({
          // the pure helpers of the real service, they do not use `this`
          getErrorText: InputHelperService.prototype.getErrorText,
          buildDescribedBy: InputHelperService.prototype.buildDescribedBy,
          randChars: vi
            .fn()
            .mockName('randChars')
            .mockImplementation(() => `mock-random-${++callCount}`),
          getTitle: vi.fn().mockName('getTitle').mockReturnValue('Test Title'),
          getLabel: vi.fn().mockName('getLabel').mockReturnValue('Test Label'),
          getPlaceholder: vi.fn().mockName('getPlaceholder').mockReturnValue('Test Placeholder'),
          getPrepend: vi.fn().mockName('getPrepend').mockReturnValue('Test Prepend'),
          getAppend: vi.fn().mockName('getAppend').mockReturnValue('Test Append'),
          isRequired: vi.fn().mockName('isRequired').mockReturnValue(true),
          validateField: vi.fn().mockName('validateField').mockReturnValue(true)
        })
    };

    // Set up the mock injector before TestBed configuration
    Object.defineProperty(DdataCoreModule, 'InjectorInstance', {
      value: mockInjector,
      writable: true
    });

    await TestBed.configureTestingModule({
      declarations: [DdataSimpleSelectComponent],
      imports: [FormsModule, FontAwesomeModule],
      providers: [{ provide: InputHelperService, useValue: mockInjector.get() }]
    }).compileComponents();

    fixture = TestBed.createComponent(DdataSimpleSelectComponent);
    component = fixture.componentInstance;

    // Set up component with mock data
    component.model = mockModel;
    component.field = 'country_id';
    component.items = mockCountries;
    component.text = 'name';
    component.valueField = 'id';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Properties', () => {
    it('should have default values for inputs', () => {
      expect(component.wrapperClass).toBe('dd-field');
      expect(component.inputBlockClass).toBe('dd-field-control');
      expect(component.inputBlockExtraClass).toBe('');
      expect(component.unselectedText).toBe('Válassz');
      expect(component.isRequired).toBe(false);
      expect(component.disabledAppearance).toBe(false);
      expect(component.disabled).toBe(false);
      expect(component.addEmptyOption).toBe(true);
      expect(component.field).toBe('country_id');
      expect(component.text).toBe('name');
      expect(component.valueField).toBe('id');
    });

    it('should generate unique id', () => {
      component.field = 'test_field';
      const id1 = component.id;
      const newComponent = new DdataSimpleSelectComponent();

      newComponent.field = 'test_field';
      const id2 = newComponent.id;

      expect(id1).toContain('test_field_');
      expect(id2).toContain('test_field_');
      expect(id1).not.toBe(id2);
    });
  });

  describe('selectItem', () => {
    beforeEach(() => {
      component.model = { country_id: 2 } as unknown as MockModel;
      component.field = 'country_id';
      component.items = mockCountries;
      component.valueField = 'id';
    });

    it('should find and set selected model based on field value', () => {
      vi.spyOn(component.selected, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.selectModel, 'emit').mockReturnValue(undefined);

      component.selectItem();

      expect(component.selectModel.emit).toHaveBeenCalledWith(mockCountry2);
    });

    it('should emit selected event with field value', () => {
      vi.spyOn(component.selected, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.selectModel, 'emit').mockReturnValue(undefined);

      component.selectItem();

      expect(component.selected.emit).toHaveBeenCalledWith(2);
    });

    it('should emit selectModel event with found model', () => {
      vi.spyOn(component.selected, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.selectModel, 'emit').mockReturnValue(undefined);

      component.selectItem();

      expect(component.selectModel.emit).toHaveBeenCalledWith(mockCountry2);
    });

    it('should handle when no matching item is found', () => {
      component.model = { country_id: 999 } as unknown as MockModel;
      vi.spyOn(component.selected, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.selectModel, 'emit').mockReturnValue(undefined);

      component.selectItem();

      expect(component.selected.emit).toHaveBeenCalledWith(999);
      expect(component.selectModel.emit).toHaveBeenCalledWith(undefined);
    });

    it('should work with different field configurations', () => {
      component.model = { tag_id: 1 } as unknown as MockModel;
      component.field = 'tag_id';
      component.items = [
        { id: 1, tag_id: 1, name: 'Tag 1' },
        { id: 2, tag_id: 2, name: 'Tag 2' }
      ];
      vi.spyOn(component.selected, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.selectModel, 'emit').mockReturnValue(undefined);

      component.selectItem();

      expect(component.selectModel.emit).toHaveBeenCalledWith({ id: 1, tag_id: 1, name: 'Tag 1' });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null model gracefully', () => {
      component.model = null;

      expect(() => component.selectItem()).not.toThrow();

      // Should not emit events when model is null
      vi.spyOn(component.selected, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.selectModel, 'emit').mockReturnValue(undefined);

      component.selectItem();

      expect(component.selected.emit).not.toHaveBeenCalled();
      expect(component.selectModel.emit).not.toHaveBeenCalled();
    });

    it('should handle empty items array', () => {
      component.items = [];
      component.model = { country_id: 1, validationErrors: [] } as unknown as MockModel;
      vi.spyOn(component.selected, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.selectModel, 'emit').mockReturnValue(undefined);

      component.selectItem();

      expect(component.selected.emit).toHaveBeenCalledWith(1);
      expect(component.selectModel.emit).toHaveBeenCalledWith(undefined);
    });

    it('should handle null items array', () => {
      component.items = null;
      component.model = { country_id: 1, validationErrors: [] } as unknown as MockModel;

      expect(() => component.selectItem()).toThrow();
    });

    it('should handle undefined field in model', () => {
      component.model = {} as unknown as MockModel;
      component.field = 'nonexistent_field';
      vi.spyOn(component.selected, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.selectModel, 'emit').mockReturnValue(undefined);

      component.selectItem();

      expect(component.selected.emit).toHaveBeenCalledWith(undefined);
      expect(component.selectModel.emit).toHaveBeenCalledWith(undefined);
    });

    it('should handle items with missing field values', () => {
      component.items = [
        { name: 'Item 1' }, // missing id
        { id: 2, name: 'Item 2' }
      ];
      component.model = { country_id: 2 } as unknown as MockModel;
      component.field = 'country_id';
      vi.spyOn(component.selected, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.selectModel, 'emit').mockReturnValue(undefined);

      component.selectItem();

      expect(component.selectModel.emit).toHaveBeenCalledWith({ id: 2, name: 'Item 2' });
    });
  });

  describe('Component Configuration', () => {
    it('should allow custom wrapper class', () => {
      component.wrapperClass = 'custom-wrapper';

      expect(component.wrapperClass).toBe('custom-wrapper');
    });

    it('should allow custom input block classes', () => {
      component.inputBlockClass = 'custom-input';
      component.inputBlockExtraClass = 'custom-extra';

      expect(component.inputBlockClass).toBe('custom-input');
      expect(component.inputBlockExtraClass).toBe('custom-extra');
    });

    it('should allow custom label configuration', () => {
      component.labelClass = 'custom-label';
      component.showLabel = false;
      component.labelText = 'Custom Label';

      expect(component.labelClass).toBe('custom-label');
      expect(component.showLabel).toBe(false);
      expect(component.labelText).toBe('Custom Label');
    });

    it('should allow custom text elements', () => {
      component.prepend = 'Before';
      component.append = 'After';
      component.unselectedText = 'Choose one';

      expect(component.prepend).toBe('Before');
      expect(component.append).toBe('After');
      expect(component.unselectedText).toBe('Choose one');
    });

    it('should allow behavior configuration', () => {
      component.isRequired = true;
      component.disabledAppearance = true;
      component.disabled = true;
      component.addEmptyOption = false;

      expect(component.isRequired).toBe(true);
      expect(component.disabledAppearance).toBe(true);
      expect(component.disabled).toBe(true);
      expect(component.addEmptyOption).toBe(false);
    });

    it('should allow field configuration', () => {
      component.text = 'title';
      component.valueField = 'key';

      expect(component.text).toBe('title');
      expect(component.valueField).toBe('key');
    });
  });

  describe('Integration Tests', () => {
    it('should work with complex object structures', () => {
      const complexItems = [
        { id: 1, name: 'Item 1', metadata: { category: 'A' } },
        { id: 2, name: 'Item 2', metadata: { category: 'B' } },
        { id: 3, name: 'Item 3', metadata: { category: 'A' } }
      ];

      component.items = complexItems;
      component.model = { item_id: 2 } as unknown as MockModel;
      component.field = 'item_id';
      component.valueField = 'id';

      vi.spyOn(component.selectModel, 'emit').mockReturnValue(undefined);

      component.selectItem();

      expect(component.selectModel.emit).toHaveBeenCalledWith(complexItems[1]);
    });

    it('should handle multiple select operations', () => {
      vi.spyOn(component.selected, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.selectModel, 'emit').mockReturnValue(undefined);

      // First selection
      component.model = { country_id: 1 } as unknown as MockModel;
      component.selectItem();

      expect(component.selected.emit).toHaveBeenCalledWith(1);
      expect(component.selectModel.emit).toHaveBeenCalledWith(mockCountry1);

      // Second selection
      component.model = { country_id: 3 } as unknown as MockModel;
      component.selectItem();

      expect(component.selected.emit).toHaveBeenCalledWith(3);
      expect(component.selectModel.emit).toHaveBeenCalledWith(mockCountry3);
    });
  });

  describe('Async Model Handling (User Issue Fix)', () => {
    it('should not throw errors when selectItem is called with null model', () => {
      component.model = null;
      component.items = [{ id: 1, name: 'Test' }];

      expect(() => component.selectItem()).not.toThrow();
    });

    it('should handle null model gracefully in template condition', () => {
      component.model = null;

      expect(component.model).toBeNull();
    });
  });

  describe('Selected value type', () => {
    it('should keep numeric values numeric when an option is chosen', () => {
      const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;

      select.selectedIndex = 3; // empty option + 3 items -> Mexico
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(component.model['country_id']).toBe(3);
    });
  });

  describe('Required Field Asterisk Display', () => {
    it('should render the component and label when model is provided', () => {
      // Ensure we have a proper model setup
      component.model = {
        country_id: 2,
        validationErrors: []
      } as unknown as MockModel;
      component.showLabel = true;
      component.labelText = 'Country';

      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const labelElement = compiled.querySelector('label');

      expect(labelElement).toBeTruthy();
      expect(labelElement?.textContent).toContain('Country');
    });

    it('should show asterisk (*) when field is required', () => {
      // Ensure we have a proper model setup
      component.model = {
        country_id: 2,
        validationErrors: []
      } as unknown as MockModel;
      component.isRequired = true;
      component.showLabel = true;
      component.labelText = 'Country';

      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const labelElement = compiled.querySelector('label');

      expect(labelElement).toBeTruthy();
      // Check for any span containing asterisk
      const allSpans = compiled.querySelectorAll('span');
      let hasAsterisk = false;

      for (const span of allSpans) {
        if (span.textContent?.includes('*')) {
          hasAsterisk = true;
          break;
        }
      }

      expect(hasAsterisk).toBe(true);
    });
  });

  describe('form field skeleton', () => {
    const FIELD = 'country_id';
    const withMessages = (options: {
      errors: Array<string>;
      help?: string;
      message?: string;
    }): MockModel => ({
      ...mockModel,
      validationErrors: options.errors,
      fields: { country_id: { label: 'Ország', title: 'Ország', help: options.help } },
      getFieldErrorMessage: options.message ? () => options.message : undefined
    });
    const query = (selector: string): HTMLElement => fixture.nativeElement.querySelector(selector);
    const render = (extra: Record<string, unknown> = {}): void => {
      const base = { ...mockModel, validationErrors: [] };

      fixture.componentRef.setInput('model', base);
      Object.entries(extra).forEach(([key, value]) => fixture.componentRef.setInput(key, value));
      fixture.detectChanges();
    };
    const describedBy = (): Array<string> =>
      (query('select').getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);

    it('should render the label above the .dd-control without a colon', () => {
      render({ showLabel: true, labelText: 'Címke', isRequired: true });

      expect(query('.dd-field > .dd-field-label-row > label.form-label')).not.toBeNull();
      expect(query('label').textContent.replace(/\s+/g, ' ').trim()).toBe('Címke *');
      expect(query('.dd-required').getAttribute('aria-hidden')).toBe('true');
      expect(query('.dd-field-control .dd-control select')).not.toBeNull();
      expect(query('select').getAttribute('aria-required')).toBe('true');
    });

    it('should render the chevron as an aria-hidden icon', () => {
      render({});

      expect(query('.dd-control .dd-control-chevron').getAttribute('aria-hidden')).toBe('true');
    });

    it('should not render the label row without a label', () => {
      render({ showLabel: false });

      expect(query('label')).toBeNull();
      expect(query('.dd-field-label-row')).toBeNull();
    });

    it('should render the help text and reference it', () => {
      render({ helpText: 'Súgó' });

      expect(query('.form-text').textContent.trim()).toBe('Súgó');
      expect(describedBy()).toEqual([query('.form-text').id]);
    });

    it('should render the help of the model', () => {
      render({ model: withMessages({ errors: [], help: 'Súgó a modellből' }) });

      expect(query('.form-text').textContent.trim()).toBe('Súgó a modellből');
    });

    it('should render the error message with the suggestion, the icon and aria attributes', () => {
      render({
        model: withMessages({ errors: [FIELD], message: 'Kötelező mező.' }),
        errorSuggestion: 'Válassz egyet.'
      });
      const error = query('.invalid-feedback.d-flex');

      expect(error.querySelector('span').textContent).toBe('Kötelező mező. Válassz egyet.');
      expect(error.querySelector('fa-icon').getAttribute('aria-hidden')).toBe('true');
      expect(query('.dd-control').classList).toContain('is-invalid');
      expect(query('select').getAttribute('aria-invalid')).toBe('true');
      expect(describedBy()).toEqual([error.id]);

      fixture.componentRef.setInput('errorText', 'Saját üzenet');
      fixture.detectChanges();

      expect(query('.invalid-feedback span').textContent).toBe('Saját üzenet Válassz egyet.');
    });

    it('should only mark the border when the model has no message', () => {
      render({ model: withMessages({ errors: [FIELD] }) });

      expect(query('.invalid-feedback')).toBeNull();
      expect(query('.dd-control').classList).toContain('is-invalid');
      expect(query('select').getAttribute('aria-invalid')).toBe('true');
    });

    it('should not render a message or aria-invalid for a valid field', () => {
      render({ errorText: 'Nem látszhat' });

      expect(query('.invalid-feedback')).toBeNull();
      expect(query('select').hasAttribute('aria-invalid')).toBe(false);
      expect(query('select').hasAttribute('aria-describedby')).toBe(false);
    });

    it('should render the size, the layout and the disabled state', () => {
      render({ size: 'sm', layout: 'inline', disabled: true });

      expect(query('.dd-control').classList).toContain('dd-control-sm');
      expect(query('.dd-control').classList).toContain('is-disabled');
      expect(query('.dd-field').classList).toContain('dd-field-inline');
    });

    it('should render the prepend and the append inside the control', () => {
      render({ prepend: 'Ft', append: 'db' });

      expect(
        Array.from(fixture.nativeElement.querySelectorAll('.dd-control > .dd-control-affix')).map(
          (affix) => (affix as HTMLElement).textContent.trim()
        )
      ).toEqual(['Ft', 'db']);
    });

    it('should use a custom chevron icon', () => {
      render({ chevronIcon: faSort });

      expect(query('.dd-control-chevron svg').getAttribute('data-icon')).toBe('sort');
    });
  });
});
