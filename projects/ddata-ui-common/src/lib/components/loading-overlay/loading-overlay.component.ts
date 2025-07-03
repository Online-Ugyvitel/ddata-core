import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { DdataCoreModule, SpinnerService, SpinnerServiceInterface } from 'ddata-core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
    selector: 'dd-loading-overlay',
    templateUrl: './loading-overlay.component.html',
    styleUrls: ['./loading-overlay.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class DdataUiLoadingOverlayComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  spinner$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loadingInProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Input() set loadingInProgress(value: boolean) {
    this.loadingInProgress$.next(!!value);
  }
  @Input() set spinner(value: boolean) {
    this.spinner$.next(value);
  }
  @Input() spinnerService: SpinnerServiceInterface = DdataCoreModule.InjectorInstance.get<SpinnerService>(SpinnerService);

  icon = {
    spinner: faSpinner
  };

  constructor() { }

  ngOnInit(): void {
    this.subscriptions.add(
      this.spinnerService.watch().subscribe((isLoading: boolean) => {
        this.loadingInProgress$.next(isLoading);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
