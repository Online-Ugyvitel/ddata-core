import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WordCounterComponent } from './word-counter.component';

describe('WordCounterComponent', () => {
  let component: WordCounterComponent;
  let fixture: ComponentFixture<WordCounterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WordCounterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('maxLength property', () => {
    it('should have default value of 0', () => {
      expect(component.maxLength).toBe(0);
    });

    it('should accept custom maxLength value', () => {
      component.maxLength = 5;
      expect(component.maxLength).toBe(5);
    });
  });

  describe('currentLength setter', () => {
    it('should not set _currentLength when value is null', () => {
      const initialValue = component._currentLength;
      component.currentLength = null;
      expect(component._currentLength).toBe(initialValue);
    });

    it('should not set _currentLength when value is undefined', () => {
      const initialValue = component._currentLength;
      component.currentLength = undefined;
      expect(component._currentLength).toBe(initialValue);
    });

    it('should set _currentLength when value is provided', () => {
      const testValue = 'test,value,string';
      component.currentLength = testValue;
      expect(component._currentLength).toBe(testValue);
    });

    it('should set _currentLength when value is empty string', () => {
      component.currentLength = '';
      expect(component._currentLength).toBe('');
    });
  });

  describe('wordsNumber method', () => {
    it('should return 0 when _currentLength is empty', () => {
      component._currentLength = '';
      const result = component.wordsNumber();
      expect(result).toBe(0);
    });

    it('should return 1 for single word', () => {
      component._currentLength = 'single';
      const result = component.wordsNumber();
      expect(result).toBe(1);
    });

    it('should count comma-separated words correctly', () => {
      component._currentLength = 'word1,word2,word3';
      const result = component.wordsNumber();
      expect(result).toBe(3);
    });

    it('should count words with spaces around commas', () => {
      component._currentLength = 'word1, word2, word3';
      const result = component.wordsNumber();
      expect(result).toBe(3);
    });

    it('should handle trailing comma', () => {
      component._currentLength = 'word1,word2,';
      const result = component.wordsNumber();
      expect(result).toBe(3);
    });

    it('should handle leading comma', () => {
      component._currentLength = ',word1,word2';
      const result = component.wordsNumber();
      expect(result).toBe(3);
    });

    it('should handle multiple consecutive commas', () => {
      component._currentLength = 'word1,,word2';
      const result = component.wordsNumber();
      expect(result).toBe(3);
    });
  });

  describe('maxLengthReached event emission', () => {
    it('should emit false when maxLength is 0', () => {
      spyOn(component.maxLengthReached, 'emit');
      component.maxLength = 0;
      component._currentLength = 'word1,word2,word3';

      component.wordsNumber();

      expect(component.maxLengthReached.emit).toHaveBeenCalledWith(false);
    });

    it('should emit false when word count is within limit', () => {
      spyOn(component.maxLengthReached, 'emit');
      component.maxLength = 5;
      component._currentLength = 'word1,word2,word3';

      component.wordsNumber();

      expect(component.maxLengthReached.emit).toHaveBeenCalledWith(false);
    });

    it('should emit false when word count equals limit', () => {
      spyOn(component.maxLengthReached, 'emit');
      component.maxLength = 3;
      component._currentLength = 'word1,word2,word3';

      component.wordsNumber();

      expect(component.maxLengthReached.emit).toHaveBeenCalledWith(false);
    });

    it('should emit true when word count exceeds limit', () => {
      spyOn(component.maxLengthReached, 'emit');
      component.maxLength = 2;
      component._currentLength = 'word1,word2,word3';

      component.wordsNumber();

      expect(component.maxLengthReached.emit).toHaveBeenCalledWith(true);
    });

    it('should emit false when _currentLength is empty regardless of maxLength', () => {
      spyOn(component.maxLengthReached, 'emit');
      component.maxLength = 1;
      component._currentLength = '';

      component.wordsNumber();

      expect(component.maxLengthReached.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('template integration', () => {
    it('should render word count and max length in template', () => {
      component.maxLength = 5;
      component._currentLength = 'word1,word2';
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      const spanElement = compiled.querySelector('.input-group-text');
      
      expect(spanElement.textContent.trim()).toBe('2 / 5');
    });

    it('should apply bg-warning class when word count exceeds maxLength', () => {
      component.maxLength = 2;
      component._currentLength = 'word1,word2,word3';
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      const spanElement = compiled.querySelector('.input-group-text');
      
      expect(spanElement.classList).toContain('bg-warning');
    });

    it('should not apply bg-warning class when word count is within limit', () => {
      component.maxLength = 5;
      component._currentLength = 'word1,word2';
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      const spanElement = compiled.querySelector('.input-group-text');
      
      expect(spanElement.classList).not.toContain('bg-warning');
    });

    it('should not apply bg-warning class when maxLength is 0', () => {
      component.maxLength = 0;
      component._currentLength = 'word1,word2,word3';
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      const spanElement = compiled.querySelector('.input-group-text');
      
      expect(spanElement.classList).not.toContain('bg-warning');
    });
  });

  describe('constructor', () => {
    it('should initialize with default values', () => {
      const newComponent = new WordCounterComponent();
      expect(newComponent.maxLength).toBe(0);
      expect(newComponent._currentLength).toBe('');
      expect(newComponent.maxLengthReached).toBeDefined();
    });
  });
});
