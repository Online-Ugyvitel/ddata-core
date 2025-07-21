/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DdataCoreModule } from '../../ddata-core.module';
import { InitialDataInterface } from '../../models/initial-data/initial-data.interface';
import { InitialData } from '../../models/initial-data/initial-data.model';
import { ProxyService } from '../proxy/proxy.service';
import { SpinnerService } from '../spinner/spinner.service';
import { StorageService } from '../storage/storage.service';
import { InitialDataServiceInterface } from './initial-data-service.interface';

@Injectable({
  providedIn: 'root'
})
export class InitialDataService extends ProxyService<any> implements InitialDataServiceInterface {
  private readonly initModel: InitialDataInterface = new InitialData();
  private readonly spinner: SpinnerService =
    DdataCoreModule.InjectorInstance.get<SpinnerService>(SpinnerService);

  constructor(private readonly storageService: StorageService) {
    super(new InitialData());
  }

  /**
   * Reload the initial datas into the localstorage to speed-up the software.
   */
  refresh(): Observable<boolean> {
    this.spinner.on('dashboard-init');

    return this.getUri(this.initModel.api_endpoint).pipe(
      map((result: any) => {
        // we get here key-value based object, then storage them into localStorage
        Object.keys(result).forEach((key) => {
          this.storageService.setItem(key, JSON.stringify(result[key]));
        });

        this.spinner.off('dashboard-init');

        return true;
      })
    );
  }
}
