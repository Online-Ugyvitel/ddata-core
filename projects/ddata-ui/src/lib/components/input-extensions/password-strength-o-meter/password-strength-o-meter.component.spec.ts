import { PasswordStrengthOMeterComponent } from './password-strength-o-meter.component';

describe('PasswordStrengthOMeterComponent', () => {
  let component: PasswordStrengthOMeterComponent;

  beforeEach(() => {
    component = new PasswordStrengthOMeterComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should give a weak password return to 0', () => {
    component.password = 'mindegy';

    expect(component.progress).toBe(0);
  });

  it('should give a medium password return to 37.5', () => {
    component.password = 'Test12';

    expect(component.progress).toBe(37.5);
  });

  it('should give a good password return to 63', () => {
    component.password = 'TeszTeles2@';

    expect(component.progress).toBe(63);
  });
});
