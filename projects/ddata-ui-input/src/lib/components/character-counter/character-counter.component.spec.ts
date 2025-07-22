import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CharacterCounterComponent } from './character-counter.component';

describe('CharacterCounterComponent', () => {
  let component: CharacterCounterComponent;
  let fixture: ComponentFixture<CharacterCounterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CharacterCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component._currentLength).toBe('');
    expect(component.maxLength).toBe(0);
  });

  it('should set maxLength property', () => {
    const maxLength = 100;
    component.maxLength = maxLength;
    expect(component.maxLength).toBe(maxLength);
  });

  describe('currentLength setter', () => {
    it('should set _currentLength to empty string when value is null', () => {
      component.currentLength = null;
      expect(component._currentLength).toBe('');
    });

    it('should set _currentLength to empty string when value is undefined', () => {
      component.currentLength = undefined;
      expect(component._currentLength).toBe('');
    });

    it('should set _currentLength to empty string when value is empty string', () => {
      component.currentLength = '';
      expect(component._currentLength).toBe('');
    });

    it('should set _currentLength when value is a valid string', () => {
      const testValue = 'test string';
      component.currentLength = testValue;
      expect(component._currentLength).toBe(testValue);
    });

    it('should set _currentLength when value is "0"', () => {
      component.currentLength = '0';
      expect(component._currentLength).toBe('0');
    });

    it('should set _currentLength when value is whitespace', () => {
      component.currentLength = '   ';
      expect(component._currentLength).toBe('   ');
    });

    it('should handle falsy values correctly', () => {
      // Test various falsy values
      component.currentLength = false as any;
      expect(component._currentLength).toBe('');
      
      component.currentLength = 0 as any;
      expect(component._currentLength).toBe('');
      
      component.currentLength = NaN as any;
      expect(component._currentLength).toBe('');
    });
  });

  it('should have correct component selector', () => {
    const compiled = fixture.nativeElement;
    expect(fixture.componentInstance).toBeDefined();
  });

  it('should handle multiple currentLength assignments', () => {
    component.currentLength = 'first';
    expect(component._currentLength).toBe('first');
    
    component.currentLength = 'second';
    expect(component._currentLength).toBe('second');
    
    component.currentLength = null;
    expect(component._currentLength).toBe(''); // Should become empty
    
    component.currentLength = 'third';
    expect(component._currentLength).toBe('third');
  });

  it('should maintain maxLength default value', () => {
    expect(component.maxLength).toBe(0);
    component.maxLength = 50;
    expect(component.maxLength).toBe(50);
    component.maxLength = 0;
    expect(component.maxLength).toBe(0);
  });
});
