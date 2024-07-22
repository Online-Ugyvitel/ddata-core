import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { DdataCoreModule, SpinnerService, SpinnerServiceInterface } from 'ddata-core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dd-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.css']
})
export class DdataUiLoadingOverlayComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  // tslint:disable-next-line: variable-name
  _spinner = true;
  @Input() loadingInProgress = false;
  @Input() set spinner(value: boolean) {
    this._spinner = value;
  }
  @Input() spinnerService: SpinnerServiceInterface = DdataCoreModule.InjectorInstance.get<SpinnerService>(SpinnerService);

  icon = {
    spinner: faSpinner
  };

  constructor() { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.spinnerService.watch().subscribe((isLoading: boolean) => {
        this.loadingInProgress = isLoading;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
