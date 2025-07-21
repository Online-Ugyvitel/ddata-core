import 'zone.js/testing';
import { Component, DebugElement, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DdataSelectableListElementButtonComponent } from './dd-selectable-list-element-button.component';
import { SelectableInterface } from '../../models/selectable/selectable.interface';
import { Selectable } from '../../models/selectable/selectable.model';

describe('DdataSelectableListElementButtonComponent', () => {
  let component: DdataSelectableListElementButtonComponent;
  let fixture: ComponentFixture<DdataSelectableListElementButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DdataSelectableListElementButtonComponent]
    });

    fixture = TestBed.createComponent(DdataSelectableListElementButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture && fixture.debugElement) {
      const nativeElement = fixture.debugElement.nativeElement;
      if (nativeElement && nativeElement.parentNode) {
        nativeElement.parentNode.removeChild(nativeElement);
      }
    }
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should be an instance of DdataSelectableListElementButtonComponent', () => {
    expect(component).toBeInstanceOf(DdataSelectableListElementButtonComponent);
  });

  it('should have model input property with default Selectable instance', () => {
    expect(component.model).toBeDefined();
    expect(component.model).toBeInstanceOf(Selectable);
    expect(component.model.is_selected).toBe(false);
  });

  it('should have choosed output property as EventEmitter', () => {
    expect(component.choosed).toBeDefined();
    expect(component.choosed).toBeInstanceOf(EventEmitter);
  });

  it('should implement DdataSelectableListElementButtonComponentInterface', () => {
    // Verify the component has all interface properties and methods
    expect(component.model).toBeDefined();
    expect(component.choosed).toBeDefined();
    expect(typeof component.chooseSelect).toBe('function');
  });

  it('should accept custom model input', () => {
    const customModel: SelectableInterface = new Selectable();
    customModel.is_selected = true;

    component.model = customModel;
    fixture.detectChanges();

    expect(component.model).toBe(customModel);
    expect(component.model.is_selected).toBe(true);
  });

  it('should emit model when chooseSelect is called', () => {
    const testModel: SelectableInterface = new Selectable();
    testModel.is_selected = true;
    
    spyOn(component.choosed, 'emit');

    component.chooseSelect(testModel);

    expect(component.choosed.emit).toHaveBeenCalledWith(testModel);
    expect(component.choosed.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit component model when chooseSelect is called with component model', () => {
    component.model.is_selected = true;
    
    spyOn(component.choosed, 'emit');

    component.chooseSelect(component.model);

    expect(component.choosed.emit).toHaveBeenCalledWith(component.model);
    expect(component.model.is_selected).toBe(true);
  });

  it('should emit different model when chooseSelect is called with different model', () => {
    const differentModel: SelectableInterface = new Selectable();
    differentModel.is_selected = true;
    
    spyOn(component.choosed, 'emit');

    component.chooseSelect(differentModel);

    expect(component.choosed.emit).toHaveBeenCalledWith(differentModel);
    expect(component.choosed.emit).not.toHaveBeenCalledWith(component.model);
  });

  it('should render a button element', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'));
    
    expect(buttonElement).toBeTruthy();
    expect(buttonElement.nativeElement.tagName.toLowerCase()).toBe('button');
  });

  it('should have correct button classes', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'));
    
    expect(buttonElement.nativeElement.className).toContain('mr-1');
    expect(buttonElement.nativeElement.className).toContain('btn');
    expect(buttonElement.nativeElement.className).toContain('btn-primary');
  });

  it('should have button type set to "button"', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'));
    
    expect(buttonElement.nativeElement.type).toBe('button');
  });

  it('should call chooseSelect with component model when button is clicked', () => {
    spyOn(component, 'chooseSelect');
    
    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.nativeElement.click();

    expect(component.chooseSelect).toHaveBeenCalledWith(component.model);
    expect(component.chooseSelect).toHaveBeenCalledTimes(1);
  });

  it('should emit choosed event when button is clicked', () => {
    spyOn(component.choosed, 'emit');
    
    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.nativeElement.click();

    expect(component.choosed.emit).toHaveBeenCalledWith(component.model);
  });

  it('should emit correct model when button is clicked with custom model', () => {
    const customModel: SelectableInterface = new Selectable();
    customModel.is_selected = true;
    component.model = customModel;
    fixture.detectChanges();
    
    spyOn(component.choosed, 'emit');
    
    const buttonElement = fixture.debugElement.query(By.css('button'));
    buttonElement.nativeElement.click();

    expect(component.choosed.emit).toHaveBeenCalledWith(customModel);
    expect(component.choosed.emit).toHaveBeenCalledTimes(1);
  });

  it('should support ng-content projection', () => {
    // Create a test host component to test content projection
    @Component({
      template: `
        <dd-selectable-list-element-button>
          <span class="test-content">Test Content</span>
        </dd-selectable-list-element-button>
      `
    })
    class TestHostComponent {}

    TestBed.configureTestingModule({
      declarations: [DdataSelectableListElementButtonComponent, TestHostComponent]
    });

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const projectedContent = hostFixture.debugElement.query(By.css('.test-content'));
    expect(projectedContent).toBeTruthy();
    expect(projectedContent.nativeElement.textContent.trim()).toBe('Test Content');
  });

  it('should handle null model gracefully', () => {
    component.model = null as any;
    
    spyOn(component.choosed, 'emit');

    component.chooseSelect(null as any);

    expect(component.choosed.emit).toHaveBeenCalledWith(null);
  });

  it('should handle undefined model gracefully', () => {
    spyOn(component.choosed, 'emit');

    component.chooseSelect(undefined as any);

    expect(component.choosed.emit).toHaveBeenCalledWith(undefined);
  });

  it('should maintain button accessibility', () => {
    const buttonElement = fixture.debugElement.query(By.css('button'));
    
    // Button should be focusable
    expect(buttonElement.nativeElement.tabIndex).not.toBe(-1);
    
    // Button should have proper type
    expect(buttonElement.nativeElement.type).toBe('button');
  });

  it('should work with multiple instances', () => {
    const model1: SelectableInterface = new Selectable();
    const model2: SelectableInterface = new Selectable();
    model1.is_selected = false;
    model2.is_selected = true;

    // Test first instance
    component.model = model1;
    spyOn(component.choosed, 'emit');
    component.chooseSelect(model1);
    expect(component.choosed.emit).toHaveBeenCalledWith(model1);

    // Reset spy
    (component.choosed.emit as jasmine.Spy).calls.reset();

    // Test second instance
    component.model = model2;
    component.chooseSelect(model2);
    expect(component.choosed.emit).toHaveBeenCalledWith(model2);
  });

  it('should emit the exact same object reference that was passed to chooseSelect', () => {
    const testModel: SelectableInterface = new Selectable();
    testModel.is_selected = true;
    
    spyOn(component.choosed, 'emit');

    component.chooseSelect(testModel);

    expect(component.choosed.emit).toHaveBeenCalledWith(testModel);
    
    // Verify it's the exact same object reference
    const emittedValue = (component.choosed.emit as jasmine.Spy).calls.mostRecent().args[0];
    expect(emittedValue).toBe(testModel);
  });
});