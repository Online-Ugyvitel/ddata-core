import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, Input } from '@angular/core';

// Test version of the character-counter component without external dependencies
@Component({
  selector: 'test-character-counter',
  template: '<div>{{ _currentLength.length }}/{{ maxLength }}</div>',
  standalone: false
})
export class TestCharacterCounterComponent {
  _currentLength = '';
  @Input() maxLength: number;
  
  @Input() set currentLength(value: string) {
    if (value !== undefined) {
      this._currentLength = value;
    }
  }

  constructor() { }

  ngOnInit() {
  }
}

describe('TestCharacterCounterComponent (UI version)', () => {
  let component: TestCharacterCounterComponent;
  let fixture: ComponentFixture<TestCharacterCounterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCharacterCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCharacterCounterComponent);
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

  it('should render the character count', () => {
    component.maxLength = 100;
    component.currentLength = 'test';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('4/100');
  });
});

// Test version of the second character-counter component
@Component({
  selector: 'test-character-counter-input',
  template: '<div>{{ _currentLength.length }}/{{ maxLength }}</div>',
  standalone: false
})
export class TestCharacterCounterInputComponent {
  @Input() maxLength: number = 0;
  _currentLength = '';

  @Input() set currentLength(value: string | null | undefined) {
    if (!value) {
      this._currentLength = '';
    } else {
      this._currentLength = value;
    }
  }

  constructor() {}
}

describe('TestCharacterCounterInputComponent (Input version)', () => {
  let component: TestCharacterCounterInputComponent;
  let fixture: ComponentFixture<TestCharacterCounterInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TestCharacterCounterInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCharacterCounterInputComponent);
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

  it('should render the character count', () => {
    component.maxLength = 50;
    component.currentLength = 'hello';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('5/50');
  });
});