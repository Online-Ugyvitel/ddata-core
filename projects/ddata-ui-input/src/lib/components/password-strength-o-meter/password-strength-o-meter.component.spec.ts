import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER, Observable, Subject } from 'rxjs';
import { WEAK_PASSWORDS } from '../../services/password-strength/password-strength';
import {
  PWNED_PASSWORDS_FETCH,
  PWNED_PASSWORDS_HASHER,
  PwnedPasswordCheckResult,
  PwnedPasswordsFetch,
  PwnedPasswordsService
} from '../../services/pwned-passwords/pwned-passwords.service';
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
  // the online check never answers by default, so the local rating is shown
  const pwnedService = {
    check$: vi.fn((_password: string): Observable<PwnedPasswordCheckResult> => NEVER)
  };
  const create = async (providers: Array<unknown> = []): Promise<void> => {
    pwnedService.check$.mockClear();
    await TestBed.configureTestingModule({
      declarations: [PasswordStrengthOMeterComponent],
      providers: [{ provide: PwnedPasswordsService, useValue: pwnedService }, ...(providers as [])]
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

  describe('with the Pwned Passwords check', () => {
    const pwnedText =
      'Ez a jelszó szerepel a Have I Been Pwned (Pwned Passwords) adatbázisában. Válassz másik jelszót.';
    const warning = (): HTMLElement | null =>
      fixture.nativeElement.querySelector('.password-strength-pwned');
    const unavailable = (): HTMLElement | null =>
      fixture.nativeElement.querySelector('.password-strength-pwned-unavailable');
    const host = (): HTMLElement => fixture.nativeElement;
    let checks: Array<{
      password: string;
      result: Subject<PwnedPasswordCheckResult>;
      closed: boolean;
    }>;
    const answer = (index: number, result: PwnedPasswordCheckResult): void => {
      checks[index].result.next(result);
      checks[index].result.complete();
      fixture.detectChanges();
    };
    const wait = (ms = 400): void => {
      vi.advanceTimersByTime(ms);
      fixture.detectChanges();
    };

    beforeEach(async () => {
      vi.useFakeTimers();
      await create();
      checks = [];
      pwnedService.check$.mockImplementation(
        (password: string) =>
          new Observable<PwnedPasswordCheckResult>((subscriber) => {
            const check = {
              password,
              result: new Subject<PwnedPasswordCheckResult>(),
              closed: false
            };

            checks.push(check);
            check.result.subscribe(subscriber);

            return (): void => {
              check.closed = true;
            };
          })
      );
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should be enabled by default and rate a compromised password to 0 / weak', () => {
      render('TeszTelesJelszo2@');

      expect(component.checkPwnedPasswords).toBe(true);
      expect(component.pwnedStatus).toBe('checking');
      expect(bar().getAttribute('aria-busy')).toBe('true');
      // the local rating is shown while checking, but the password isn't marked as safe
      expect(component.progress).toBe(100);
      expect(host().getAttribute('data-pwned-status')).toBe('checking');
      expect(pwnedService.check$).not.toHaveBeenCalled();

      wait();

      expect(pwnedService.check$).toHaveBeenCalledWith('TeszTelesJelszo2@');

      answer(0, 'compromised');

      expect(component.pwnedStatus).toBe('compromised');
      expect(component.progress).toBe(0);
      expect(component.level).toBe('weak');
      expect(bar().style.width).toBe('0%');
      expect(bar().classList).toContain('bg-danger');
      expect(bar().classList).not.toContain('bg-success');
      expect(bar().getAttribute('aria-valuenow')).toBe('0');
      expect(bar().getAttribute('aria-valuetext')).toBe('Jelszó erőssége: Gyenge');
      expect(bar().getAttribute('aria-busy')).toBeNull();
      expect(text()).toBe('Jelszó erőssége: Gyenge');
      expect(warning()?.textContent.trim()).toBe(pwnedText);
      expect(warning()?.getAttribute('role')).toBe('alert');
      expect(host().getAttribute('data-pwned-status')).toBe('compromised');
    });

    it('should keep the local rating when the password is not found', () => {
      render('Xxxxxxxxxxx@');
      wait();
      answer(0, 'not-found');

      expect(component.pwnedStatus).toBe('not-found');
      expect(component.progress).toBe(75);
      expect(bar().classList).toContain('bg-success');
      expect(warning()).toBeNull();
      expect(unavailable()).toBeNull();
    });

    it('should still rate a password from the weak password list to 0', () => {
      render('Password');
      wait();
      answer(0, 'not-found');

      expect(component.progress).toBe(0);
      expect(warning()).toBeNull();
    });

    it('should check a short password too', () => {
      render('abc');
      wait();

      expect(pwnedService.check$).toHaveBeenCalledWith('abc');
    });

    it.each([null, undefined, ''])('should not check %s', (password) => {
      render('first');
      render(password);
      wait(1000);

      expect(pwnedService.check$).not.toHaveBeenCalled();
      expect(component.pwnedStatus).toBe('idle');
      expect(host().getAttribute('data-pwned-status')).toBe('idle');
    });

    it('should debounce the typing and check only the last password', () => {
      render('T');
      wait(100);
      render('Te');
      wait(100);
      render('Tes');
      wait(399);

      expect(pwnedService.check$).not.toHaveBeenCalled();

      wait(1);

      expect(pwnedService.check$).toHaveBeenCalledTimes(1);
      expect(pwnedService.check$).toHaveBeenCalledWith('Tes');
    });

    it('should use the pwnedDebounceTime input', () => {
      fixture.componentRef.setInput('pwnedDebounceTime', 50);
      render('TeszTelesJelszo2@');
      wait(50);

      expect(pwnedService.check$).toHaveBeenCalledTimes(1);
    });

    it('should not request the same password again', () => {
      render('TeszTelesJelszo2@');
      wait();
      answer(0, 'not-found');
      fixture.componentRef.setInput('showText', false);
      fixture.detectChanges();
      wait();

      expect(pwnedService.check$).toHaveBeenCalledTimes(1);
      expect(component.pwnedStatus).toBe('not-found');
    });

    it('should cancel the previous check and ignore its late response', () => {
      render('first password');
      wait();
      render('second password');

      expect(checks[0].closed).toBe(true);

      // the late response of the first password arrives after the change
      answer(0, 'compromised');

      expect(component.pwnedStatus).toBe('checking');
      expect(warning()).toBeNull();

      wait();
      answer(1, 'not-found');

      expect(component.pwnedStatus).toBe('not-found');
    });

    it('should remove the warning immediately when a compromised password changes', () => {
      render('TeszTelesJelszo2@');
      wait();
      answer(0, 'compromised');

      expect(warning()).not.toBeNull();

      render('TeszTelesJelszo2@!');

      expect(warning()).toBeNull();
      expect(component.pwnedStatus).toBe('checking');
      expect(component.progress).toBe(100);
    });

    it('should not use the result for a password changed without change detection', () => {
      render('TeszTelesJelszo2@');
      wait();
      answer(0, 'compromised');
      component.password = 'TeszTelesJelszo2@!';

      expect(component.pwnedStatus).toBe('checking');
      expect(component.progress).toBe(100);
    });

    it('should not take an old result for the current password', () => {
      render('aaaaaaaa1');
      wait();
      answer(0, 'compromised');
      render('bbbbbbbb1');
      // only the result of the current password counts, even when the same object comes back later
      render('aaaaaaaa1');

      expect(component.pwnedStatus).toBe('checking');

      wait();
      answer(1, 'compromised');

      expect(component.pwnedStatus).toBe('compromised');
      expect(pwnedService.check$).toHaveBeenCalledTimes(2);
    });

    it('should show the unavailable message and keep the local rating', () => {
      render('TeszTelesJelszo2@');
      wait();
      answer(0, 'unavailable');

      expect(component.pwnedStatus).toBe('unavailable');
      expect(component.progress).toBe(100);
      expect(warning()).toBeNull();
      expect(unavailable()?.textContent.trim()).toBe(
        'Az online jelszóellenőrzés jelenleg nem érhető el.'
      );
      expect(unavailable()?.getAttribute('role')).toBe('status');
      // no retry
      wait(10_000);

      expect(pwnedService.check$).toHaveBeenCalledTimes(1);
    });

    it('should hide the unavailable message with an empty text and use a custom one', () => {
      fixture.componentRef.setInput('pwnedUnavailableText', '');
      render('TeszTelesJelszo2@');
      wait();
      answer(0, 'unavailable');

      expect(unavailable()).toBeNull();

      fixture.componentRef.setInput('pwnedUnavailableText', 'Offline');
      fixture.detectChanges();

      expect(unavailable()?.textContent.trim()).toBe('Offline');
    });

    it('should show a custom warning also with showText=false', () => {
      fixture.componentRef.setInput('showText', false);
      fixture.componentRef.setInput('pwnedText', 'This password has been pwned.');
      render('TeszTelesJelszo2@');
      wait();
      answer(0, 'compromised');

      expect(text()).toBeUndefined();
      expect(warning()?.textContent.trim()).toBe('This password has been pwned.');
    });

    it('should not check and not warn with checkPwnedPasswords=false', () => {
      fixture.componentRef.setInput('checkPwnedPasswords', false);
      render('TeszTelesJelszo2@');
      wait(1000);

      expect(pwnedService.check$).not.toHaveBeenCalled();
      expect(component.pwnedStatus).toBe('idle');
      expect(component.progress).toBe(100);
      expect(bar().getAttribute('aria-busy')).toBeNull();
      expect(warning()).toBeNull();
    });

    it('should handle switching the check off and on', () => {
      render('TeszTelesJelszo2@');
      wait();
      answer(0, 'compromised');

      expect(component.progress).toBe(0);

      fixture.componentRef.setInput('checkPwnedPasswords', false);
      fixture.detectChanges();

      expect(component.pwnedStatus).toBe('idle');
      expect(component.progress).toBe(100);
      expect(warning()).toBeNull();

      // a pending check is cancelled when it's switched off
      fixture.componentRef.setInput('checkPwnedPasswords', true);
      fixture.detectChanges();

      expect(component.pwnedStatus).toBe('checking');

      wait();
      fixture.componentRef.setInput('checkPwnedPasswords', false);
      fixture.detectChanges();

      expect(checks[1].closed).toBe(true);

      fixture.componentRef.setInput('checkPwnedPasswords', true);
      fixture.detectChanges();
      wait();
      answer(2, 'compromised');

      expect(component.progress).toBe(0);
      expect(pwnedService.check$).toHaveBeenCalledTimes(3);
    });

    it('should cancel the check when the component is destroyed', () => {
      render('TeszTelesJelszo2@');
      wait();
      fixture.destroy();

      expect(checks[0].closed).toBe(true);
    });

    it('should not start a pending check after destroy', () => {
      render('TeszTelesJelszo2@');
      fixture.destroy();
      vi.advanceTimersByTime(1000);

      expect(pwnedService.check$).not.toHaveBeenCalled();
    });
  });

  describe('with the real service and a mocked API', () => {
    // SHA-1('password') = 5BAA6 1E4C9B93F3F0682250B6CF8331B7EE68FD8
    const fetchMock = vi.fn<PwnedPasswordsFetch>();
    const createWithApi = async (providers: Array<unknown> = []): Promise<void> => {
      await TestBed.configureTestingModule({
        declarations: [PasswordStrengthOMeterComponent],
        providers: [{ provide: PWNED_PASSWORDS_FETCH, useValue: fetchMock }, ...(providers as [])]
      }).compileComponents();
      fixture = TestBed.createComponent(PasswordStrengthOMeterComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('pwnedDebounceTime', 0);
    };
    const settle = async (): Promise<void> => {
      await vi.waitFor(() => expect(component.pwnedStatus).not.toBe('checking'));
      fixture.detectChanges();
    };

    beforeEach(() => {
      fetchMock.mockReset();
    });

    it('should rate a pwned password to 0 and send only the hash prefix', async () => {
      fetchMock.mockResolvedValue(
        new Response(
          '0018A45C4D1DEF81644B54AB7F969B88D65:1\r\n1e4c9b93f3f0682250b6cf8331b7ee68fd8:9545824\r\n'
        )
      );
      await createWithApi([{ provide: WEAK_PASSWORDS, useValue: [] }]);
      render('password');
      await settle();

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe('https://api.pwnedpasswords.com/range/5BAA6');
      expect(component.pwnedStatus).toBe('compromised');
      expect(bar().getAttribute('aria-valuenow')).toBe('0');
      expect(fixture.nativeElement.querySelector('[role="alert"]')).not.toBeNull();
    });

    it('should keep the local rating for a padding line with 0 count', async () => {
      fetchMock.mockResolvedValue(new Response('1E4C9B93F3F0682250B6CF8331B7EE68FD8:0\n'));
      await createWithApi([{ provide: WEAK_PASSWORDS, useValue: [] }]);
      render('password');
      await settle();

      expect(component.pwnedStatus).toBe('not-found');
      expect(component.progress).toBe(25);
    });

    it.each([
      [
        'HTTP 429',
        async (): Promise<Response> => Promise.resolve(new Response('', { status: 429 }))
      ],
      [
        'network error',
        async (): Promise<Response> => Promise.reject(new TypeError('Failed to fetch'))
      ],
      ['invalid response', async (): Promise<Response> => Promise.resolve(new Response('<html>'))]
    ])('should give unavailable for a(n) %s', async (_name, result) => {
      fetchMock.mockImplementation(result);
      await createWithApi();
      render('TeszTelesJelszo2@');
      await settle();

      expect(component.pwnedStatus).toBe('unavailable');
      expect(component.progress).toBe(100);
      expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
    });

    it('should give unavailable without the Web Crypto API', async () => {
      await createWithApi([
        {
          provide: PWNED_PASSWORDS_HASHER,
          useValue: async (): Promise<string> => {
            throw new Error('no crypto');
          }
        }
      ]);
      render('TeszTelesJelszo2@');
      await settle();

      expect(component.pwnedStatus).toBe('unavailable');
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
