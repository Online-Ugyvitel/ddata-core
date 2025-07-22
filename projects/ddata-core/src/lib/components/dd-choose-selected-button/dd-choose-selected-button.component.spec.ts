import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { DdataChooseSelectedButtonComponent } from './dd-choose-selected-button.component';

describe('DdataChooseSelectedButtonComponent', () => {
  let component: DdataChooseSelectedButtonComponent;
  let fixture: ComponentFixture<DdataChooseSelectedButtonComponent>;
  let compiled: HTMLElement;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DdataChooseSelectedButtonComponent]
    });

    fixture = TestBed.createComponent(DdataChooseSelectedButtonComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    debugElement = fixture.debugElement;
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Properties', () => {
    it('should have multipleSelectEnabled input property with default value true', () => {
      expect(component.multipleSelectEnabled).toBe(true);
    });

    it('should accept custom value for multipleSelectEnabled input', () => {
      component.multipleSelectEnabled = false;
      expect(component.multipleSelectEnabled).toBe(false);
      
      component.multipleSelectEnabled = true;
      expect(component.multipleSelectEnabled).toBe(true);
    });

    it('should allow multipleSelectEnabled to be set via input binding', () => {
      component.multipleSelectEnabled = false;
      fixture.detectChanges();
      expect(component.multipleSelectEnabled).toBe(false);
    });
  });

  describe('Output Properties', () => {
    it('should have choosed output property as EventEmitter', () => {
      expect(component.choosed).toBeDefined();
      expect(typeof component.choosed.emit).toBe('function');
      expect(typeof component.choosed.subscribe).toBe('function');
    });

    it('should emit choosed event when chooseSelect is called', () => {
      spyOn(component.choosed, 'emit');
      
      component.chooseSelect();
      
      expect(component.choosed.emit).toHaveBeenCalled();
      expect(component.choosed.emit).toHaveBeenCalledWith();
      expect(component.choosed.emit).toHaveBeenCalledTimes(1);
    });

    it('should allow subscription to choosed event', () => {
      let eventEmitted = false;
      
      component.choosed.subscribe(() => {
        eventEmitted = true;
      });
      
      component.chooseSelect();
      
      expect(eventEmitted).toBe(true);
    });

    it('should emit choosed event multiple times when chooseSelect is called multiple times', () => {
      spyOn(component.choosed, 'emit');
      
      component.chooseSelect();
      component.chooseSelect();
      component.chooseSelect();
      
      expect(component.choosed.emit).toHaveBeenCalledTimes(3);
    });
  });

  describe('Methods', () => {
    it('should have chooseSelect method', () => {
      expect(typeof component.chooseSelect).toBe('function');
    });

    it('should emit choosed event when chooseSelect method is called', () => {
      let emittedValue: any;
      
      component.choosed.subscribe((value) => {
        emittedValue = value;
      });
      
      component.chooseSelect();
      
      expect(emittedValue).toBeUndefined(); // The emit is called without parameters
    });

    it('should not throw error when chooseSelect is called', () => {
      expect(() => component.chooseSelect()).not.toThrow();
    });
  });

  describe('Template Integration', () => {
    it('should render a button element', () => {
      const buttonElement = compiled.querySelector('button');
      expect(buttonElement).toBeTruthy();
    });

    it('should have correct CSS classes on button', () => {
      const buttonElement = compiled.querySelector('button');
      expect(buttonElement).toBeTruthy();
      expect(buttonElement!.classList.contains('mr-1')).toBe(true);
      expect(buttonElement!.classList.contains('btn')).toBe(true);
      expect(buttonElement!.classList.contains('btn-primary')).toBe(true);
    });

    it('should have correct button type', () => {
      const buttonElement = compiled.querySelector('button');
      expect(buttonElement).toBeTruthy();
      expect(buttonElement!.getAttribute('type')).toBe('button');
    });

    it('should call chooseSelect method when button is clicked', () => {
      spyOn(component, 'chooseSelect');
      
      const buttonElement = compiled.querySelector('button');
      expect(buttonElement).toBeTruthy();
      
      buttonElement!.click();
      
      expect(component.chooseSelect).toHaveBeenCalled();
      expect(component.chooseSelect).toHaveBeenCalledTimes(1);
    });

    it('should emit choosed event when button is clicked', () => {
      spyOn(component.choosed, 'emit');
      
      const buttonElement = compiled.querySelector('button');
      expect(buttonElement).toBeTruthy();
      
      buttonElement!.click();
      
      expect(component.choosed.emit).toHaveBeenCalled();
    });

    it('should trigger click event using DebugElement', () => {
      spyOn(component, 'chooseSelect');
      
      const buttonDebugElement = debugElement.query(By.css('button'));
      expect(buttonDebugElement).toBeTruthy();
      
      buttonDebugElement.triggerEventHandler('click', null);
      
      expect(component.chooseSelect).toHaveBeenCalled();
    });

    it('should handle multiple button clicks correctly', () => {
      spyOn(component.choosed, 'emit');
      
      const buttonElement = compiled.querySelector('button');
      expect(buttonElement).toBeTruthy();
      
      buttonElement!.click();
      buttonElement!.click();
      buttonElement!.click();
      
      expect(component.choosed.emit).toHaveBeenCalledTimes(3);
    });

    it('should support ng-content projection', () => {
      const buttonElement = compiled.querySelector('button');
      expect(buttonElement).toBeTruthy();
      
      // The button should contain ng-content element or placeholder for projected content
      // Check if the template is set up to support content projection
      expect(buttonElement!.innerHTML).toBeDefined();
    });
  });

  describe('Component Lifecycle', () => {
    it('should maintain state after multiple interactions', () => {
      component.multipleSelectEnabled = false;
      
      component.chooseSelect();
      
      expect(component.multipleSelectEnabled).toBe(false);
      
      component.multipleSelectEnabled = true;
      component.chooseSelect();
      
      expect(component.multipleSelectEnabled).toBe(true);
    });

    it('should handle property changes after initialization', () => {
      expect(component.multipleSelectEnabled).toBe(true);
      
      component.multipleSelectEnabled = false;
      fixture.detectChanges();
      
      expect(component.multipleSelectEnabled).toBe(false);
      
      spyOn(component.choosed, 'emit');
      component.chooseSelect();
      expect(component.choosed.emit).toHaveBeenCalled();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle undefined multipleSelectEnabled gracefully', () => {
      (component as any).multipleSelectEnabled = undefined;
      expect(() => component.chooseSelect()).not.toThrow();
    });

    it('should handle null multipleSelectEnabled gracefully', () => {
      (component as any).multipleSelectEnabled = null;
      expect(() => component.chooseSelect()).not.toThrow();
    });
    
    it('should work with different boolean values for multipleSelectEnabled', () => {
      const values = [true, false, 0 as any, 1 as any, '' as any, 'true' as any];
      
      values.forEach(value => {
        component.multipleSelectEnabled = value;
        expect(() => component.chooseSelect()).not.toThrow();
      });
    });
  });

  describe('Interface Implementation', () => {
    it('should implement required interface properties', () => {
      expect(component.multipleSelectEnabled).toBeDefined();
      expect(component.choosed).toBeDefined();
    });

    it('should implement required interface methods', () => {
      expect(typeof component.chooseSelect).toBe('function');
    });

    it('should have correct property types', () => {
      expect(typeof component.multipleSelectEnabled).toBe('boolean');
      expect(component.choosed.constructor.name).toContain('EventEmitter');
    });
  });
});