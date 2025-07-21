/* eslint-disable @typescript-eslint/no-explicit-any */
export class DdataCoreError {
  msg = '';

  constructor(public originalError?: any) {
    if (!!originalError.error) {
      if (!!originalError.error.trace) {
        originalError.error.trace.forEach((trace: any) => {
          if (trace.file !== undefined && trace.line !== undefined) {
            if (trace.file.match(/app\/Http\/Controllers\//)) {
              this.msg += `${trace.file}:${trace.line}`;
            }
          }
        });
      }
    }
  }
}
