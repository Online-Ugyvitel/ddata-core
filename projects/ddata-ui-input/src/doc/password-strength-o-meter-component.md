# Password Strength-o-meter Component

Shows the strength of a password as a colored progress bar.


## Usage

```html
<dd-input [model]="user" field="password" type="password"></dd-input>
<dd-password-strength-o-meter [password]="user.password"></dd-password-strength-o-meter>
```

The password is also checked online in the [Have I Been Pwned – Pwned Passwords](https://haveibeenpwned.com/API/v3#PwnedPasswords)
database by default (see below). To use the local rating only:

```html
<dd-password-strength-o-meter [password]="password" [checkPwnedPasswords]="false" />
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


## Pwned Passwords check

Enabled by default (`checkPwnedPasswords = true`), it needs no backend, proxy or API key: the browser
calls `GET https://api.pwnedpasswords.com/range/{prefix}` directly (the API supports CORS).

- **The password never leaves the browser.** Its SHA-1 hash is calculated locally with the Web Crypto
  API (`crypto.subtle`, UTF-8), and only the first 5 characters of the hash are sent (k-anonymity).
  The remaining 35 characters are compared locally with the `HASH_SUFFIX:COUNT` lines of the response.
  SHA-1 is part of the API protocol only, it isn't a password storage method.
- The request sends the `Add-Padding: true` header, the padding lines (count `0`) are ignored. If the
  padded request is rejected (e.g. by the CORS preflight), it is repeated once without the header.
  The `User-Agent` is the one the browser sends.
- A password found with a count above 0 is always rated **0% / weak**, whatever its local rating is,
  and a warning with `role="alert"` is shown (also with `showText = false`).
- The check starts `pwnedDebounceTime` (400 ms) after the last change, also for short passwords, but
  never for `null`, `undefined` or `''`. A new password cancels the previous request, and a late
  response never changes the result of the current password. The range responses of the last 20 hash
  prefixes are kept in memory, the password and its hash are never logged or stored.
- While the check is in progress or when it fails, the password is **not** treated as safe, but the local
  rating is shown. On a failure (no Web Crypto API — e.g. not a secure context —, network or CORS error,
  HTTP 403 / 429 / 5xx, invalid response) the `pwnedUnavailableText` message is shown, and there is no
  retry until the password changes.
- The state is available as `pwnedStatus` (`idle`, `checking`, `compromised`, `not-found`,
  `unavailable`) and as the `data-pwned-status` attribute of the host element. The progress bar has
  `aria-busy="true"` while checking.

The check is in the `PwnedPasswordsService`, usable without the component too:

```typescript
import { PwnedPasswordsService } from '@netdjw/ddata-ui-input';

const status = await inject(PwnedPasswordsService).check('password'); // 'compromised'
```

Its dependencies can be replaced with the `PWNED_PASSWORDS_CONFIG` (`apiUrl`, `addPadding`),
`PWNED_PASSWORDS_FETCH` and `PWNED_PASSWORDS_HASHER` injection tokens, e.g. in the tests.


## API

| Parameter name | Type | Required | Default value | Description |
|----------------|------|----------|---------------|-------------|
| `password` | `string \| null \| undefined` | yes | `''` | The password to rate. |
| `weakPasswords` | `ReadonlyArray<string> \| null` | no | `null` | Overrides the `WEAK_PASSWORDS` token. |
| `showText` | `boolean` | no | `true` | Shows the strength as text under the bar. |
| `label` | `string` | no | `Jelszó erőssége` | Accessible name of the progress bar. |
| `texts` | `Record<'weak' \| 'medium' \| 'strong', string>` | no | `Gyenge` / `Közepes` / `Erős` | Texts of the levels. |
| `checkPwnedPasswords` | `boolean` | no | `true` | Checks the password in the Pwned Passwords database. `false`: no request, local rating only. |
| `pwnedText` | `string` | no | `Ez a jelszó szerepel a Have I Been Pwned (Pwned Passwords) adatbázisában. Válassz másik jelszót.` | Warning for a pwned password. |
| `pwnedUnavailableText` | `string` | no | `Az online jelszóellenőrzés jelenleg nem érhető el.` | Shown when the online check failed, `''` hides it. |
| `pwnedDebounceTime` | `number` | no | `400` | Milliseconds after the last change before the online check. |


## Accessibility

The bar has `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and an
`aria-valuetext` with the text of the level, so the information isn't carried by the color only.
The Pwned Passwords warning is a text with `role="alert"`, shown only after the debounced check, so
it isn't read out on every keystroke. The unavailable message has `role="status"`.
