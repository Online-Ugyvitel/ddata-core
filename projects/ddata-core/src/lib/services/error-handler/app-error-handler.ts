import { ErrorHandler, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { DdataInjectorModule } from '../../ddata-injector.module';
import { NotificationService } from '../notification/notification.service';
import { SpinnerService } from '../spinner/spinner.service';
import { StorageService } from '../storage/storage.service';
import { BadRequest } from './bad-request-error';
import { ErrorMessageFromApi } from './error-message-from-api-error';
import { ForbiddenError } from './forbidden-error';
import { InternalServerError } from './internal-server-error';
import { MethodNotAllowedError } from './method-not-allowed-error';
import { NotFoundError } from './not-found-error';
import { ThirdPartyError } from './third-party-error';
import { UnauthorizedError } from './unauthorized-error';
import { UnprocessableEntity } from './unprocessable-entity-error';
import { AppValidationError } from './validation-error';

@Injectable({
  providedIn: 'root'
})
export class DdataCoreErrorHandler extends ErrorHandler {
  // storageService: StorageService = DdataInjectorModule.InjectorInstance.get<StorageService>(StorageService);
  // spinner: SpinnerService = DdataInjectorModule.InjectorInstance.get<SpinnerService>(SpinnerService);
  // notificationService: NotificationService = DdataInjectorModule.InjectorInstance.get<NotificationService>(NotificationService);

  constructor(
    private readonly storageService: StorageService,
    private readonly spinner: SpinnerService,
    private readonly notificationService: NotificationService
  ) {
    super();
  }

  handleError(err: any): any {
    const router = DdataInjectorModule.InjectorInstance.get(Router);
    const error = !!err.originalError ? err.originalError : err;
    let result: any;

    console.error('A részletes hiba:', err);

    if (error.status === 400) {
      result = throwError(new BadRequest(error, this.notificationService));
    }

    if (error.status === 401) {
      result = throwError(new UnauthorizedError(router, error, this.storageService));
    }

    if (error.status === 403) {
      result = throwError(new ForbiddenError(error, this.notificationService));
    }

    if (error.status === 404) {
      result = throwError(new NotFoundError(error, this.notificationService));
    }

    if (error.status === 405) {
      result = throwError(new MethodNotAllowedError(error, this.notificationService));
    }

    if (error.status === 422) {
      result = throwError(new UnprocessableEntity(error, this.notificationService));
    }

    if (error.status === 430) {
      result = throwError(new ErrorMessageFromApi(error, this.notificationService));
    }

    if (error.status === 480 || err instanceof AppValidationError) {
      result = throwError(new AppValidationError(error, this.notificationService));
    }

    if (error.status === 500) {
      result = throwError(new InternalServerError(error, this.notificationService));
    }

    if (error.status === 580) {
      result = throwError(new ThirdPartyError(error, this.notificationService));
    }

    this.spinner.off('ERROR_HANDLER');

    return result;
    // TODO egyéb hibák kezelését + ismeretlen hibák kezelését is meg kell oldani
  }
}
