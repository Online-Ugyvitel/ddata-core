import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterCounterComponent } from './character-counter.component';

describe('CharacterCounterComponent', () => {
  let component: CharacterCounterComponent;
  let fixture: ComponentFixture<CharacterCounterComponent>;
  const text = (): string =>
    (fixture.nativeElement as HTMLElement)
      .querySelector('.input-group-text')
      ?.textContent?.trim() ?? '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterCounterComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default values', () => {
    expect(component.maxLength).toBe(0);
    expect(component._currentLength).toBe('');
    expect(text()).toBe('0 / 0');
  });

  it('should store the given value', () => {
    component.currentLength = 'hello';

    expect(component._currentLength).toBe('hello');
  });

  it.each([null, undefined, ''])(
    'should reset the value to an empty string when it gets %s',
    (value) => {
      component.currentLength = 'hello';
      component.currentLength = value;

      expect(component._currentLength).toBe('');
    }
  );

  it('should render the current length and the max length', () => {
    fixture.componentRef.setInput('maxLength', 20);
    fixture.componentRef.setInput('currentLength', 'hello');
    fixture.detectChanges();

    expect(text()).toBe('5 / 20');
  });

  it('should render the title of the counter', () => {
    const wrapper = (fixture.nativeElement as HTMLElement).querySelector('.input-group-append');

    expect(wrapper?.getAttribute('title')).toBe('Karakterek száma');
  });

  it('should follow the changes of the inputs', () => {
    fixture.componentRef.setInput('maxLength', 10);
    fixture.componentRef.setInput('currentLength', 'abc');
    fixture.detectChanges();

    expect(text()).toBe('3 / 10');

    fixture.componentRef.setInput('maxLength', 50);
    fixture.componentRef.setInput('currentLength', 'abcdefg');
    fixture.detectChanges();

    expect(text()).toBe('7 / 50');

    fixture.componentRef.setInput('currentLength', null);
    fixture.detectChanges();

    expect(text()).toBe('0 / 50');
  });
  describe('edge cases', () => {
    const render = (value: string | null | undefined, maxLength = 5): void => {
      fixture.componentRef.setInput('maxLength', maxLength);
      fixture.componentRef.setInput('currentLength', value);
      fixture.detectChanges();
    };

    it.each([null, undefined, ''])('should render 0 characters for %j', (value) => {
      render(value);

      expect(text()).toBe('0 / 5');
    });

    it('should render exactly the max length at the boundary', () => {
      render('abcde');

      expect(text()).toBe('5 / 5');
    });

    it('should render a count over the max length on overflow', () => {
      render('abcdefg');

      expect(text()).toBe('7 / 5');
    });

    it('should count every space and line break', () => {
      render('a  b\nc\r\n', 10);

      expect(text()).toBe('8 / 10');
    });

    it('should count accented letters as one character', () => {
      render('árvíztűrő', 10);

      expect(text()).toBe('9 / 10');
    });

    it('should count astral Unicode symbols by their UTF-16 length', () => {
      render('😀', 10);

      expect(text()).toBe('2 / 10');
    });
  });
});
