import { Router } from '@angular/router';
import { DdataCoreError } from './ddata-core-error';
import { StorageService } from '../storage/storage.service';

export class UnauthorizedError extends DdataCoreError {
  constructor(router: Router, originalError: any, storageService: StorageService) {
    super(originalError);

    console.error('401 - Unauthorized Error');

    // notificationService.pushNotification('Hiba', 'A Munka folyamat élrvényessége lejárt!<br>Kérlek jelentkezz be újra.', 'danger');

    if (router.url !== '/login') {
      storageService.clear();
      const logoutNavbarItem: HTMLElement = document.getElementById('nav-logout');

      if (logoutNavbarItem !== null) {
        // ha van logout menüpont
        logoutNavbarItem.click();
      } else {
        // ha nincs logout menüpont
        const loginNavbarItem: HTMLElement = document.getElementById('nav-login');

        if (loginNavbarItem !== null) {
          // ha van login menüpont
          loginNavbarItem.click();
        } else {
          // ha nincs login menüpont sem
          router.navigate(['/login']);
        }
      }
    }
  }
}
