/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-console */
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EnvService } from '../env/env.service';
import { SpinnerServiceInterface } from './spinner-service.interface';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService implements SpinnerServiceInterface {
  /**
   * Application environment variable from the root application
   */
  private readonly appEnv = new EnvService();
  // TODO ezt vissza kell csinálni
  // private appEnv = DdataInjectorModule.InjectorInstance.get(EnvService);

  /**
   * Observable subject of spinner service
   */
  private readonly spinnerSubject = new Subject<boolean>();

  /**
   * Spinner is visible or not
   */
  private spinnerIsVisible = false;

  /**
   * Starter value of spinner service
   */
  private starter = '';

  constructor() {}

  /**
   * You can subscribe to the spinner service observable subject to react the spinner's change.
   */
  watch(): Observable<any> {
    return this.spinnerSubject.asObservable();
  }

  /**
   * Spinner can be on or off. This function do all things to change the spinner's state.
   *
   * @param state `on` or `off`
   * @param starter any unique random string to avoid multiple spinners show
   */
  private setStatus(state: 'on' | 'off', starter: string): boolean {
    if (!!this.appEnv.environment.debug) {
      console.log('global spinner set', state, starter);
    }

    if (starter === 'ERROR_HANDLER') {
      this.setValues();

      if (!!this.appEnv.environment.debug) {
        console.log('Spinner set off by ERROR_HANDLER');
      }

      return true;
    }

    if (state === 'on' && !this.spinnerIsVisible && this.starter === '') {
      this.setValues(true, starter);

      return true;
    }

    if (state === 'off' && this.spinnerIsVisible === true && this.starter === starter) {
      this.setValues();

      return true;
    }
  }

  /**
   * Set values of spinner & emit observers.
   *
   * @param isVisible boolean
   * @param starter string
   */
  private setValues(isVisible: boolean = false, starter: string = ''): void {
    this.starter = starter;
    this.spinnerIsVisible = isVisible;
    this.spinnerSubject.next(isVisible);
  }

  /**
   * Switch on the spinner.
   *
   * @param starter string - any random, unique string could be good
   */
  on(starter: string): boolean {
    return this.setStatus('on', starter);
  }

  /**
   * Switch off the spinner.
   *
   * @param starter string - same string what you used on `on()` function.
   */
  off(starter: string): boolean {
    return this.setStatus('off', starter);
  }

  /**
   * You can get the current state of the spinner.
   */
  getStatus(): boolean {
    return this.spinnerIsVisible;
  }
}
