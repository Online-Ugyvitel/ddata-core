import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WEAK_PASSWORDS } from '../../services/password-strength/password-strength';
import { PasswordStrengthOMeterComponent } from './password-strength-o-meter.component';

describe('PasswordStrengthOMeterComponent', () => {
  let component: PasswordStrengthOMeterComponent;
  let fixture: ComponentFixture<PasswordStrengthOMeterComponent>;
  const bar = (): HTMLElement => fixture.nativeElement.querySelector('[role="progressbar"]');
  const text = (): string =>
    fixture.nativeElement.querySelector('.password-strength-text')?.textContent.trim();
  const render = (password: string | null | undefined): void => {
    fixture.componentRef.setInput('password', password);
    fixture.detectChanges();
  };
  const create = async (providers = []): Promise<void> => {
    await TestBed.configureTestingModule({
      declarations: [PasswordStrengthOMeterComponent],
      providers
    }).compileComponents();
    fixture = TestBed.createComponent(PasswordStrengthOMeterComponent);
    component = fixture.componentInstance;
  };

  describe('with the default weak password list', () => {
    beforeEach(async () => create());

    it('should create with an empty password', () => {
      fixture.detectChanges();

      expect(component).toBeTruthy();
      expect(component.progress).toBe(0);
      expect(bar().style.width).toBe('0%');
      expect(bar().classList).toContain('bg-danger');
    });

    it.each([
      // 3 / 8
      ['xxxxx@', 37.5, 'bg-danger', 'Gyenge'],
      // 4 / 8
      ['xxxxxxxxx@', 50, 'bg-warning', 'Közepes'],
      // 5 / 8
      ['xxxxxxxxxxx@', 62.5, 'bg-warning', 'Közepes'],
      // 6 / 8
      ['Xxxxxxxxxxx@', 75, 'bg-success', 'Erős'],
      ['TeszTelesJelszo2@', 100, 'bg-success', 'Erős']
    ])('should render %s as %d%% with %s', (password, progress, colorClass, levelText) => {
      render(password);

      expect(component.progress).toBe(progress);
      expect(bar().style.width).toBe(`${progress}%`);
      expect(bar().classList).toContain('progress-bar');
      expect(bar().classList).toContain(colorClass);
      expect(bar().getAttribute('aria-valuenow')).toBe(String(progress));
      expect(bar().getAttribute('aria-valuetext')).toBe(`Jelszó erőssége: ${levelText}`);
      expect(text()).toBe(`Jelszó erőssége: ${levelText}`);
    });

    it('should have only one color class', () => {
      render('xxxxxxxxx@');

      expect(bar().classList).not.toContain('bg-danger');
      expect(bar().classList).not.toContain('bg-success');
    });

    it('should have static aria range attributes and a label', () => {
      fixture.detectChanges();

      expect(bar().getAttribute('aria-valuemin')).toBe('0');
      expect(bar().getAttribute('aria-valuemax')).toBe('100');
      expect(bar().getAttribute('aria-label')).toBe('Jelszó erőssége');
    });

    it('should update the aria attributes together with the score', () => {
      render('xxxxx@');

      expect(bar().getAttribute('aria-valuenow')).toBe('37.5');

      render('TeszTelesJelszo2@');

      expect(bar().getAttribute('aria-valuenow')).toBe('100');
      expect(bar().getAttribute('aria-valuetext')).toBe('Jelszó erőssége: Erős');

      render(null);

      expect(bar().getAttribute('aria-valuenow')).toBe('0');
    });

    it('should rate a password from the weak password list to 0', () => {
      render('Password');

      expect(component.progress).toBe(0);
    });

    it('should use the weakPasswords input instead of the token', () => {
      fixture.componentRef.setInput('weakPasswords', ['xxxxx@']);
      render('xxxxx@');

      expect(component.progress).toBe(0);

      render('mindegy');

      expect(component.progress).toBe(25);
    });

    it('should hide the visible text and use custom texts', () => {
      fixture.componentRef.setInput('showText', false);
      fixture.componentRef.setInput('label', 'Strength');
      fixture.componentRef.setInput('texts', { weak: 'Weak', medium: 'Medium', strong: 'Strong' });
      render('TeszTelesJelszo2@');

      expect(text()).toBeUndefined();
      expect(bar().getAttribute('aria-valuetext')).toBe('Strength: Strong');
      expect(component.level).toBe('strong');
    });
  });

  describe('with a provided weak password list', () => {
    beforeEach(async () => create([{ provide: WEAK_PASSWORDS, useValue: ['company2024'] }]));

    it('should use the WEAK_PASSWORDS token', () => {
      render('Company2024');

      expect(component.progress).toBe(0);

      render('mindegy');

      expect(component.progress).toBe(25);
    });
  });
});
