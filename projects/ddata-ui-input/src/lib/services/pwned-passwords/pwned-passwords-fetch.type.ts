/** The `fetch` implementation used by the Pwned Passwords check. */
export type PwnedPasswordsFetch = (input: string, init?: RequestInit) => Promise<Response>;
