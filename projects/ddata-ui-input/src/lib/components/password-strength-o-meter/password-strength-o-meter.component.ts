import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subject, concat, distinctUntilChanged, map, of, switchMap, timer } from 'rxjs';
import {
  PasswordStrengthLevel,
  WEAK_PASSWORDS,
  calculatePasswordStrength,
  getPasswordStrengthLevel
} from '../../services/password-strength/password-strength';
import { PwnedPasswordStatus } from '../../services/pwned-passwords/pwned-password-status.type';
import { PwnedPasswordsService } from '../../services/pwned-passwords/pwned-passwords.service';
import { PwnedRequestInterface } from './pwned-request.interface';
import { PwnedStateInterface } from './pwned-state.interface';

export type PasswordStrengthTexts = Record<PasswordStrengthLevel, string>;

@Component({
  selector: 'dd-password-strength-o-meter',
  templateUrl: './password-strength-o-meter.component.html',
  styleUrls: ['./password-strength-o-meter.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-pwned-status]': 'pwnedStatus'
  }
})
export class PasswordStrengthOMeterComponent implements OnChanges {
  @Input() password: string | null | undefined = '';
  // overrides the WEAK_PASSWORDS injection token for this instance
  @Input() weakPasswords: ReadonlyArray<string> | null = null;
  @Input() showText = true;
  @Input() label = 'Jelszó erőssége';
  @Input() texts: PasswordStrengthTexts = {
    weak: 'Gyenge',
    medium: 'Közepes',
    strong: 'Erős'
  };

  /** Checks the password online in the Have I Been Pwned Pwned Passwords database. */
  @Input() checkPwnedPasswords = true;
  /** Warning for a password found in the Pwned Passwords database. */
  @Input() pwnedText =
    'Ez a jelszó szerepel a Have I Been Pwned (Pwned Passwords) adatbázisában. Válassz másik jelszót.';

  /** Shown when the online check failed, an empty string hides it. */
  @Input() pwnedUnavailableText = 'Az online jelszóellenőrzés jelenleg nem érhető el.';
  /** Milliseconds to wait after the last change before the online check. */
  @Input() pwnedDebounceTime = 400;

  private readonly defaultWeakPasswords = inject(WEAK_PASSWORDS);
  private readonly pwnedPasswords = inject(PwnedPasswordsService);
  private readonly requests = new Subject<PwnedRequestInterface>();
  private readonly pwnedState = signal<PwnedStateInterface>({ password: '', status: 'idle' });

  constructor() {
    this.requests
      .pipe(
        distinctUntilChanged((a, b) => a.password === b.password && a.enabled === b.enabled),
        switchMap((request) => this.pwnedCheck(request)),
        takeUntilDestroyed(inject(DestroyRef))
      )
      .subscribe((state) => this.pwnedState.set(state));
  }

  ngOnChanges(): void {
    this.requests.next({ password: this.password ?? '', enabled: this.checkPwnedPasswords });
  }

  get pwnedStatus(): PwnedPasswordStatus {
    const password = this.password ?? '';

    if (!this.checkPwnedPasswords || password === '') {
      return 'idle';
    }
    const state = this.pwnedState();

    // a result belongs only to the password it was checked for
    return state.password === password ? state.status : 'checking';
  }

  get progress(): number {
    if (this.pwnedStatus === 'compromised') {
      return 0;
    }

    return calculatePasswordStrength(
      this.password,
      this.weakPasswords ?? this.defaultWeakPasswords
    );
  }

  get level(): PasswordStrengthLevel {
    return getPasswordStrengthLevel(this.progress);
  }

  get levelText(): string {
    return this.texts[this.level];
  }

  private pwnedCheck({
    password,
    enabled
  }: PwnedRequestInterface): Observable<PwnedStateInterface> {
    if (!enabled || password === '') {
      return of({ password, status: 'idle' });
    }

    return concat(
      of<PwnedStateInterface>({ password, status: 'checking' }),
      timer(this.pwnedDebounceTime).pipe(
        switchMap(() => this.pwnedPasswords.check$(password)),
        map((status) => ({ password, status }))
      )
    );
  }
}
