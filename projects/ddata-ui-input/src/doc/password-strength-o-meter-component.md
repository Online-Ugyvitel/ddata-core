# Password Strength-o-meter Component

Shows the strength of a password as a colored progress bar.


## Usage

```html
<dd-input [model]="user" field="password" type="password"></dd-input>
<dd-password-strength-o-meter [password]="user.password"></dd-password-strength-o-meter>
```


## Rating

Every rule gives 12.5 points (0–100): lowercase letter, uppercase letter, number, special character,
longer than 8, 10 and 12 characters, not in the weak password list. A password shorter than 6
characters or from the weak password list is always 0. Letters are checked Unicode aware (`á` is a
lowercase letter), and the length counts characters (an emoji is one character).

Color: below 50 `bg-danger` (weak), below 70 `bg-warning` (medium), otherwise `bg-success` (strong).

The rating is available without the component too:

```typescript
import { calculatePasswordStrength, getPasswordStrengthLevel } from '@netdjw/ddata-ui-input';

const strength = calculatePasswordStrength('TeszTeles2@'); // 87.5
const level = getPasswordStrengthLevel(strength); // 'strong'
```


## Weak password list

The list is compared case insensitively. Replace or extend it for the whole application:

```typescript
import { WEAK_PASSWORDS, defaultWeakPasswords } from '@netdjw/ddata-ui-input';

providers: [{ provide: WEAK_PASSWORDS, useValue: [...defaultWeakPasswords, 'company2024'] }]
```

or for one instance with the `weakPasswords` input.


## API

| Parameter name | Type | Required | Default value | Description |
|----------------|------|----------|---------------|-------------|
| `password` | `string \| null \| undefined` | yes | `''` | The password to rate. |
| `weakPasswords` | `ReadonlyArray<string> \| null` | no | `null` | Overrides the `WEAK_PASSWORDS` token. |
| `showText` | `boolean` | no | `true` | Shows the strength as text under the bar. |
| `label` | `string` | no | `Jelszó erőssége` | Accessible name of the progress bar. |
| `texts` | `Record<'weak' \| 'medium' \| 'strong', string>` | no | `Gyenge` / `Közepes` / `Erős` | Texts of the levels. |


## Accessibility

The bar has `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and an
`aria-valuetext` with the text of the level, so the information isn't carried by the color only.
