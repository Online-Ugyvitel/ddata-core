/* eslint-disable @typescript-eslint/no-explicit-any */
export interface InitialDataInterface {
  readonly api_endpoint: string;
  readonly model_name: string;
  loaded: boolean;
  data: any;
  refreshTime: number;
}
