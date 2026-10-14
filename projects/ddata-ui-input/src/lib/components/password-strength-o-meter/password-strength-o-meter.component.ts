import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import {
  PasswordStrengthLevel,
  WEAK_PASSWORDS,
  calculatePasswordStrength,
  getPasswordStrengthLevel
} from '../../services/password-strength/password-strength';

export type PasswordStrengthTexts = Record<PasswordStrengthLevel, string>;

@Component({
  selector: 'dd-password-strength-o-meter',
  templateUrl: './password-strength-o-meter.component.html',
  styleUrls: ['./password-strength-o-meter.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordStrengthOMeterComponent {
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

  private readonly defaultWeakPasswords = inject(WEAK_PASSWORDS);

  get progress(): number {
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
}
