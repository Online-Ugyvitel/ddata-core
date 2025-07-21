// tslint:disable: variable-name

import { InitialDataInterface } from './initial-data.interface';

export class InitialData implements InitialDataInterface {
  readonly api_endpoint = '/init';
  private _refreshTime = 5000;
  readonly model_name = 'Init';
  loaded = true;

  constructor() {}

  data: {};

  set refreshTime(miliseconds: number) {
    if (miliseconds === null || miliseconds < 5000) {
      // if not set, or less than 5000 we set it to 60 seconds - don't DDoS the server
      miliseconds = 60000;
    }

    this._refreshTime = miliseconds;
  }

  get refreshTime(): number {
    return this._refreshTime;
  }
}
