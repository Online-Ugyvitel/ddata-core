/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const error = err?.originalError || err;
    const status: number | undefined = error?.status;
    let result: any;

    console.error('A részletes hiba:', err);
    // each status code is handled by its own error class
    const creators: Record<number, () => unknown> = {
      400: () => new BadRequest(error, this.notificationService),
      401: () => new UnauthorizedError(router, error, this.storageService),
      403: () => new ForbiddenError(error, this.notificationService),
      404: () => new NotFoundError(error, this.notificationService),
      405: () => new MethodNotAllowedError(error, this.notificationService),
      422: () => new UnprocessableEntity(error, this.notificationService),
      430: () => new ErrorMessageFromApi(error, this.notificationService),
      480: () => new AppValidationError(error, this.notificationService),
      500: () => new InternalServerError(error, this.notificationService),
      580: () => new ThirdPartyError(error, this.notificationService)
    };

    if (status !== undefined && creators[status]) {
      result = throwError(creators[status]());
    }

    if (
      status !== 480 &&
      (err instanceof AppValidationError || error instanceof AppValidationError)
    ) {
      result = throwError(new AppValidationError(error, this.notificationService));
    }

    this.spinner.off('ERROR_HANDLER');

    return result;
    // TODO egyéb hibák kezelését + ismeretlen hibák kezelését is meg kell oldani
  }
}
