/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  environment: any = {};

  constructor(@Inject('env') private readonly env?: any) {
    this.environment = env ?? {};
  }
}
