// Specs compare plain literals with branded domain types (ID, FileSizeInByte, ...) and with differently typed
// error payloads, so the matchers accept any expected value in addition to the strict jasmine typings.
declare namespace jasmine {
  interface Matchers<T> {
    toBe(expected: unknown, expectationFailOutput?: unknown): void;
    toEqual(expected: unknown, expectationFailOutput?: unknown): void;
    toHaveBeenCalledWith(...params: Array<unknown>): void;
    toHaveBeenCalledOnceWith(...params: Array<unknown>): void;
  }
}
