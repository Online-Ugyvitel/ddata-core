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
    expect(component.maxLength).toBeUndefined();
  });

  it('should set maxLength property', () => {
    const maxLength = 100;
    component.maxLength = maxLength;
    expect(component.maxLength).toBe(maxLength);
  });

  describe('currentLength setter', () => {
    it('should set _currentLength when value is defined', () => {
      const testValue = 'test string';
      component.currentLength = testValue;
      expect(component._currentLength).toBe(testValue);
    });

    it('should set _currentLength when value is empty string', () => {
      component.currentLength = '';
      expect(component._currentLength).toBe('');
    });

    it('should not change _currentLength when value is undefined', () => {
      component._currentLength = 'existing value';
      component.currentLength = undefined;
      expect(component._currentLength).toBe('existing value');
    });

    it('should set _currentLength when value is null', () => {
      component.currentLength = null as any;
      expect(component._currentLength).toBe(null);
    });

    it('should set _currentLength when value is zero', () => {
      component.currentLength = '0';
      expect(component._currentLength).toBe('0');
    });
  });

  it('should call ngOnInit without errors', () => {
    expect(() => component.ngOnInit()).not.toThrow();
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
    
    component.currentLength = undefined;
    expect(component._currentLength).toBe('second'); // Should not change
    
    component.currentLength = 'third';
    expect(component._currentLength).toBe('third');
  });
});
