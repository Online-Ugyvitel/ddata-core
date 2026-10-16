export interface PwnedPasswordsConfigInterface {
  /** The range endpoint, the 5 character hash prefix is appended to it. */
  apiUrl: string;
  /** Sends the `Add-Padding: true` header, so the size of the response doesn't leak the prefix. */
  addPadding: boolean;
}
