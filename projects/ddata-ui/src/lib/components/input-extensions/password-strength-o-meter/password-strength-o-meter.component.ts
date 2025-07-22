import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'dd-password-strength-o-meter',
  templateUrl: './password-strength-o-meter.component.html',
  styleUrls: ['./password-strength-o-meter.component.css'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordStrengthOMeterComponent {
  // _level = 0;
  progress = 0;
  conditions = {
    'progress-bar': this.progress !== -1,
    'bg-danger': this.progress < 50,
    'bg-warning': this.progress >= 50 && this.progress < 70,
    'bg-success': this.progress >= 70
  };

  @Input() set password(passwordValue: string) {
    let value = passwordValue;

    if (!value) {
      // this._level = 0;
      value = '';
    }
    let passwordLevel = 0;
    const lowercaseRegExp = new RegExp(/[a-z]/);
    const uppercaseRegExp = new RegExp(/[A-Z]/);
    const numberRegExp = new RegExp(/[0-9]/);
    const specialCharacterRegExp = new RegExp(/[\W]/);

    // lowercase
    if (lowercaseRegExp.test(value)) {
      passwordLevel++;
    }

    // uppercase
    if (uppercaseRegExp.test(value)) {
      passwordLevel++;
    }

    // number
    if (numberRegExp.test(value)) {
      passwordLevel++;
    }

    // speacial character
    if (specialCharacterRegExp.test(value)) {
      passwordLevel++;
    }

    // length 1
    if (value.length > 8) {
      passwordLevel++;
    }

    // length 2
    if (value.length > 10) {
      passwordLevel++;
    }

    // length 3
    if (value.length > 12) {
      passwordLevel++;
    }
    // is a weak password?
    let isWeakPassword = 0;

    this.shitPasswordList.forEach((item) => {
      if (item === value.toLowerCase()) {
        isWeakPassword = 1;
      }
    });

    if (isWeakPassword === 0) {
      passwordLevel++;
    } else {
      passwordLevel = 0;
    }

    if (value.length < 6) {
      passwordLevel = 0;
    }

    this.progress = Number(passwordLevel / 8) * 100;
  }
  // @Input() set level(value: string) {
  //   this._level = value;
  // }

  shitPasswordList = [
    '123456',
    'password',
    '123456789',
    '12345678',
    '12345',
    '111111',
    '1234567',
    'sunshine',
    'qwerty',
    'qwertz',
    'iloveyou',
    'princess',
    'admin',
    'welcome',
    '666666',
    'abc123',
    'football',
    '123123',
    'monkey',
    '654321',
    '!@#$%^&*',
    'charlie',
    'aa123456',
    'donald',
    'password1',
    'qwerty123',
    'qwertz123',
    'asdf1234',
    'asdfghjkl',
    'jelszo',
    'jelszo1',
    'jelszó',
    'mindegy',
    'mind1'
  ];

  constructor() {}
}
