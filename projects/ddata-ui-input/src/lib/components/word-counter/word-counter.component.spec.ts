import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordCounterComponent } from './word-counter.component';

describe('WordCounterComponent', () => {
  let component: WordCounterComponent;
  let fixture: ComponentFixture<WordCounterComponent>;
  let reached: Array<boolean>;
  const counter = (): HTMLElement =>
    (fixture.nativeElement as HTMLElement).querySelector('.input-group-text');
  const text = (): string => counter().textContent.trim();
  const render = (currentLength: string | null | undefined, maxLength?: number): void => {
    if (maxLength !== undefined) {
      fixture.componentRef.setInput('maxLength', maxLength);
    }

    fixture.componentRef.setInput('currentLength', currentLength);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WordCounterComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordCounterComponent);
    component = fixture.componentInstance;
    reached = [];
    component.maxLengthReached.subscribe((value: boolean) => reached.push(value));
    fixture.detectChanges();
  });

  it('should have default values', () => {
    expect(component.maxLength).toBe(0);
    expect(component._currentLength).toBe('');
    expect(text()).toBe('0 / 0');
  });

  it('should render the title of the counter', () => {
    const wrapper = (fixture.nativeElement as HTMLElement).querySelector('.input-group-append');

    expect(wrapper.getAttribute('title')).toBe('Kulcsszavak száma');
  });

  describe('countWords', () => {
    it.each([
      ['', 0],
      [null, 0],
      [undefined, 0],
      [42, 0],
      [['a', 'b'], 0],
      ['one', 1],
      ['one,two', 2],
      ['one, two, three', 3],
      ['one two three', 1],
      ['one,,two', 3],
      [',', 2],
      ['   ', 1],
      ['first\nline,second\r\nline', 2],
      ['árvíztűrő, tükörfúrógép, 😀', 3]
    ])('should count %j as %i keyword(s)', (value, expected) => {
      expect(WordCounterComponent.countWords(value)).toBe(expected);
    });
  });

  describe('value', () => {
    it.each([null, undefined, ''])('should render 0 words for %j', (value) => {
      render(value, 5);

      expect(component._currentLength).toBe('');
      expect(text()).toBe('0 / 5');
      expect(counter().classList).not.toContain('bg-warning');
    });

    it('should reset the count when the value is cleared', () => {
      render('a,b,c', 5);

      expect(text()).toBe('3 / 5');

      render(null);

      expect(component._currentLength).toBe('');
      expect(text()).toBe('0 / 5');
    });

    it('should count line breaks, multiple spaces and Unicode as part of a keyword', () => {
      render('alma  körte,\nszilva,  🍒', 5);

      expect(text()).toBe('3 / 5');
    });
  });

  describe('limit', () => {
    it('should not warn below the limit', () => {
      render('a,b', 3);

      expect(text()).toBe('2 / 3');
      expect(counter().classList).not.toContain('bg-warning');
      expect(reached[reached.length - 1]).toBe(false);
    });

    it('should not warn exactly at the limit', () => {
      render('a,b,c', 3);

      expect(text()).toBe('3 / 3');
      expect(counter().classList).not.toContain('bg-warning');
      expect(reached[reached.length - 1]).toBe(false);
    });

    it('should warn and emit true over the limit', () => {
      render('a,b,c,d', 3);

      expect(text()).toBe('4 / 3');
      expect(counter().classList).toContain('bg-warning');
      expect(reached[reached.length - 1]).toBe(true);
    });

    it('should emit false again when the value gets back under the limit or is cleared', () => {
      render('a,b,c,d', 3);

      expect(reached[reached.length - 1]).toBe(true);

      render('a', 3);

      expect(reached[reached.length - 1]).toBe(false);

      render('a,b,c,d', 3);
      render('', 3);

      expect(reached[reached.length - 1]).toBe(false);
      expect(counter().classList).not.toContain('bg-warning');
    });

    it('should never report the limit as reached without a max length', () => {
      render('a,b,c', 0);

      expect(component.wordsNumber()).toBe(3);
      expect(reached.every((value) => value === false)).toBe(true);
    });
  });
});
