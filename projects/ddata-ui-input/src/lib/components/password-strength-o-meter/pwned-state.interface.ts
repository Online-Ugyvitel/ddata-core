import { PwnedPasswordStatus } from '../../services/pwned-passwords/pwned-password-status.type';

/** Result of the Pwned Passwords check of a password. */
export interface PwnedStateInterface {
  password: string;
  status: PwnedPasswordStatus;
}
