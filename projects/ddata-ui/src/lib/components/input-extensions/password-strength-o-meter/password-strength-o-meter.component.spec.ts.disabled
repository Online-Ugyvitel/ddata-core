import { Paginate } from './../../models/paginate/paginate.model';
import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PasswordStrengthOMeterComponent } from './password-strength-o-meter.component';
import { of } from 'rxjs';


xdescribe('AddressListComponent', () => {
  const httpClient = new HttpClient(null);
  // tslint:disable-next-line: prefer-const
  let injector: Injector;
  let component: PasswordStrengthOMeterComponent;

  // let route: Router;

  beforeEach(() => {
    // service = new BankAccountService(httpClient, injector);
    // payment = new PaymentTypeService(httpClient, injector);
    // devizaservice = new DevizaService(httpClient, injector);

    // spyOn(null, 'getAll').and.returnValue(of(paginateData));
    component = new PasswordStrengthOMeterComponent();
  });

  it('should it give a shit password return to 0', () => {
    component.password = 'mindegy';

    expect(component.progress).toBe(0);
  });

  it('should it give a good password return to 50', () => {
    component.password = 'Test12';

    expect(component.progress).toBe(37.5);
  });

  it('should it give a good password return to 50', () => {
    component.password = 'TeszTeles2@';

    expect(component.progress).toBe(63);
  });

});
