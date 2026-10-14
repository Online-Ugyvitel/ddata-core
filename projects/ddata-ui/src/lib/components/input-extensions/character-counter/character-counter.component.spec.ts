import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterCounterComponent } from './character-counter.component';

describe('CharacterCounterComponent', () => {
  let component: CharacterCounterComponent;
  let fixture: ComponentFixture<CharacterCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CharacterCounterComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(CharacterCounterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the current and the maximum length', () => {
    fixture.componentRef.setInput('maxLength', 10);
    fixture.componentRef.setInput('currentLength', 'abcd');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.trim()).toBe('4 / 10');
  });

  it('should keep the previous value when the current length is undefined', () => {
    component.currentLength = 'abc';
    component.currentLength = undefined;

    expect(component.currentLengthValue).toBe('abc');
  });
});
