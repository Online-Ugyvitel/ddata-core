/* eslint-disable @typescript-eslint/no-explicit-any */
export class DdataCoreError {
  msg = '';

  constructor(public originalError?: any) {
    const traces = originalError?.error?.trace;

    if (Array.isArray(traces)) {
      traces.forEach((trace: any) => {
        const isControllerFile =
          typeof trace?.file === 'string' && /app[\\/]Http[\\/]Controllers[\\/]/.test(trace.file);

        if (isControllerFile && trace.line !== undefined && trace.line !== null) {
          this.msg += `${trace.file}:${trace.line}`;
        }
      });
    }
  }
}
