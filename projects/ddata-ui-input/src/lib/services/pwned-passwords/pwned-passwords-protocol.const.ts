/** A full SHA-1 hash as uppercase hex. */
export const pwnedPasswordsHashPattern = /^[\dA-F]{40}$/;

/** A `HASH_SUFFIX:COUNT` line of a range response. */
export const pwnedPasswordsLinePattern = /^([\dA-F]{35}):(\d+)$/i;

/** Number of range responses kept in memory. */
export const pwnedPasswordsCacheSize = 20;
