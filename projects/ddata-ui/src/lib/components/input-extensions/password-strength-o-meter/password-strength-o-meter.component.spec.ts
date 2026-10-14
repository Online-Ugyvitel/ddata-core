import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordStrengthOMeterComponent } from './password-strength-o-meter.component';

describe('PasswordStrengthOMeterComponent', () => {
  let component: PasswordStrengthOMeterComponent;
  let fixture: ComponentFixture<PasswordStrengthOMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordStrengthOMeterComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(PasswordStrengthOMeterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should rate a password from the weak password list to 0', () => {
    component.password = 'mindegy';

    expect(component.progress).toBe(0);
  });

  it('should rate a short password to 0', () => {
    component.password = 'Ab1@';

    expect(component.progress).toBe(0);
  });

  it('should rate an empty password to 0', () => {
    component.password = undefined;

    expect(component.progress).toBe(0);
  });

  it('should rate a medium password to 50', () => {
    component.password = 'Test12';

    expect(component.progress).toBe(50);
  });

  it('should rate a good password to 87.5', () => {
    component.password = 'TeszTeles2@';

    expect(component.progress).toBe(87.5);
  });

  it('should rate a long password with every character class to 100', () => {
    component.password = 'TeszTelesJelszo2@';

    expect(component.progress).toBe(100);
  });

  it('should display the progress with the color of the strength', () => {
    fixture.componentRef.setInput('password', 'TeszTelesJelszo2@');
    fixture.detectChanges();
    const bar: HTMLElement = fixture.nativeElement.querySelector('[role="progressbar"]');

    expect(bar.style.width).toBe('100%');
    expect(bar.classList).toContain('bg-success');
  });
});
