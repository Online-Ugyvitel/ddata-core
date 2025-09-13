import { TestBed } from '@angular/core/testing';
import { SpinnerService } from './spinner.service';
import { EnvService } from '../env/env.service';
import { SpinnerServiceInterface } from './spinner-service.interface';

describe('SpinnerService', () => {
  let service: SpinnerService;
  let originalEnvService: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SpinnerService,
        { provide: 'env', useValue: { debug: false } }
      ]
    });

    service = TestBed.inject(SpinnerService);
    
    // Since SpinnerService creates EnvService instance directly, we need to spy on it
    originalEnvService = (service as any).appEnv;
  });

  describe('constructor', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
      expect(service instanceof SpinnerService).toBe(true);
    });

    it('should implement SpinnerServiceInterface', () => {
      const serviceInterface: SpinnerServiceInterface = service;
      expect(serviceInterface.watch).toBeDefined();
      expect(serviceInterface.on).toBeDefined();
      expect(serviceInterface.off).toBeDefined();
      expect(serviceInterface.getStatus).toBeDefined();
    });

    it('should initialize with correct default values', () => {
      expect(service.getStatus()).toBe(false);
    });
  });

  describe('watch()', () => {
    it('should return an observable', () => {
      const observable = service.watch();
      expect(observable).toBeDefined();
      expect(typeof observable.subscribe).toBe('function');
    });

    it('should emit true when spinner is turned on', (done) => {
      service.watch().subscribe(value => {
        expect(value).toBe(true);
        done();
      });
      
      service.on('test-starter');
    });

    it('should emit false when spinner is turned off', (done) => {
      let emissionCount = 0;
      service.watch().subscribe(value => {
        emissionCount++;
        if (emissionCount === 1) {
          // First emission - spinner on
          expect(value).toBe(true);
        } else if (emissionCount === 2) {
          // Second emission - spinner off
          expect(value).toBe(false);
          done();
        }
      });
      
      service.on('test-starter');
      service.off('test-starter');
    });

    it('should not emit until state changes', (done) => {
      let emitted = false;
      const subscription = service.watch().subscribe(value => {
        emitted = true;
      });
      
      // Wait a bit to ensure no emission happens
      setTimeout(() => {
        expect(emitted).toBe(false);
        subscription.unsubscribe();
        done();
      }, 100);
    });
  });

  describe('on()', () => {
    it('should turn on spinner with valid starter when spinner is off', () => {
      const starter = 'test-starter';
      const result = service.on(starter);
      
      expect(result).toBe(true);
      expect(service.getStatus()).toBe(true);
    });

    it('should not turn on spinner when another spinner is already active', () => {
      const firstStarter = 'first-starter';
      const secondStarter = 'second-starter';
      
      // Turn on first spinner
      const firstResult = service.on(firstStarter);
      expect(firstResult).toBe(true);
      expect(service.getStatus()).toBe(true);
      
      // Try to turn on second spinner
      const secondResult = service.on(secondStarter);
      expect(secondResult).toBeUndefined();
      expect(service.getStatus()).toBe(true);
    });

    it('should not turn on spinner when same starter is used twice', () => {
      const starter = 'test-starter';
      
      // Turn on spinner first time
      const firstResult = service.on(starter);
      expect(firstResult).toBe(true);
      expect(service.getStatus()).toBe(true);
      
      // Try to turn on spinner second time with same starter
      const secondResult = service.on(starter);
      expect(secondResult).toBeUndefined();
      expect(service.getStatus()).toBe(true);
    });

    it('should log debug message when environment.debug is true', () => {
      (service as any).appEnv.environment = { debug: true };
      spyOn(console, 'log');
      
      const starter = 'test-starter';
      service.on(starter);
      
      expect(console.log).toHaveBeenCalledWith('global spinner set', 'on', starter);
    });

    it('should not log debug message when environment.debug is false', () => {
      (service as any).appEnv.environment = { debug: false };
      spyOn(console, 'log');
      
      const starter = 'test-starter';
      service.on(starter);
      
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should emit observable change when spinner is turned on', (done) => {
      service.watch().subscribe(value => {
        expect(value).toBe(true);
        done();
      });
      
      service.on('test-starter');
    });
  });

  describe('off()', () => {
    beforeEach(() => {
      // Set up spinner in 'on' state for off tests
      service.on('test-starter');
    });

    it('should turn off spinner with matching starter', () => {
      const starter = 'test-starter';
      const result = service.off(starter);
      
      expect(result).toBe(true);
      expect(service.getStatus()).toBe(false);
    });

    it('should not turn off spinner with wrong starter', () => {
      const wrongStarter = 'wrong-starter';
      const result = service.off(wrongStarter);
      
      expect(result).toBeUndefined();
      expect(service.getStatus()).toBe(true);
    });

    it('should not turn off spinner when spinner is already off', () => {
      const starter = 'test-starter';
      
      // Turn off spinner first
      service.off(starter);
      expect(service.getStatus()).toBe(false);
      
      // Try to turn off again
      const result = service.off(starter);
      expect(result).toBeUndefined();
      expect(service.getStatus()).toBe(false);
    });

    it('should handle ERROR_HANDLER starter specially', () => {
      (service as any).appEnv.environment = { debug: true };
      spyOn(console, 'log');
      
      const result = service.off('ERROR_HANDLER');
      
      expect(result).toBe(true);
      expect(service.getStatus()).toBe(false);
      expect(console.log).toHaveBeenCalledWith('global spinner set', 'off', 'ERROR_HANDLER');
      expect(console.log).toHaveBeenCalledWith('Spinner set off by ERROR_HANDLER');
    });

    it('should handle ERROR_HANDLER starter without debug logging when debug is false', () => {
      (service as any).appEnv.environment = { debug: false };
      spyOn(console, 'log');
      
      const result = service.off('ERROR_HANDLER');
      
      expect(result).toBe(true);
      expect(service.getStatus()).toBe(false);
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should turn off spinner with ERROR_HANDLER even when started with different starter', () => {
      // Reset and start with different starter
      service.off('test-starter'); // Clean up from beforeEach
      service.on('different-starter');
      expect(service.getStatus()).toBe(true);
      
      const result = service.off('ERROR_HANDLER');
      
      expect(result).toBe(true);
      expect(service.getStatus()).toBe(false);
    });

    it('should log debug message when environment.debug is true', () => {
      (service as any).appEnv.environment = { debug: true };
      spyOn(console, 'log');
      
      const starter = 'test-starter';
      service.off(starter);
      
      expect(console.log).toHaveBeenCalledWith('global spinner set', 'off', starter);
    });

    it('should not log debug message when environment.debug is false', () => {
      (service as any).appEnv.environment = { debug: false };
      spyOn(console, 'log');
      
      const starter = 'test-starter';
      service.off(starter);
      
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should emit observable change when spinner is turned off', (done) => {
      let emissionCount = 0;
      service.watch().subscribe(value => {
        emissionCount++;
        if (emissionCount === 2) {
          // Second emission - spinner turned off
          expect(value).toBe(false);
          done();
        }
      });
      
      service.off('test-starter');
    });
  });

  describe('getStatus()', () => {
    it('should return false initially', () => {
      expect(service.getStatus()).toBe(false);
    });

    it('should return true when spinner is on', () => {
      service.on('test-starter');
      expect(service.getStatus()).toBe(true);
    });

    it('should return false when spinner is turned off', () => {
      service.on('test-starter');
      service.off('test-starter');
      expect(service.getStatus()).toBe(false);
    });

    it('should return current state consistently', () => {
      // Test multiple calls return same value
      expect(service.getStatus()).toBe(false);
      expect(service.getStatus()).toBe(false);
      
      service.on('test-starter');
      expect(service.getStatus()).toBe(true);
      expect(service.getStatus()).toBe(true);
      
      service.off('test-starter');
      expect(service.getStatus()).toBe(false);
      expect(service.getStatus()).toBe(false);
    });
  });

  describe('private setStatus() method coverage', () => {
    it('should handle on state with empty starter string condition', () => {
      // This tests the specific condition: state === 'on' && !this.spinnerIsVisible && this.starter === ''
      expect(service.getStatus()).toBe(false); // Ensure starting state
      
      const result = service.on('test-starter');
      expect(result).toBe(true);
    });

    it('should handle off state with matching starter condition', () => {
      // This tests the specific condition: state === 'off' && this.spinnerIsVisible === true && this.starter === starter
      service.on('test-starter');
      expect(service.getStatus()).toBe(true);
      
      const result = service.off('test-starter');
      expect(result).toBe(true);
    });

    it('should return undefined for invalid state transitions', () => {
      // Test that setStatus returns undefined when conditions are not met
      service.on('first-starter');
      const result = service.on('second-starter');
      expect(result).toBeUndefined();
    });
  });

  describe('private setValues() method coverage', () => {
    it('should set default values when called without parameters', () => {
      service.on('test-starter');
      service.off('test-starter'); // This calls setValues() with defaults
      
      expect(service.getStatus()).toBe(false);
    });

    it('should set custom values when called with parameters', () => {
      service.on('test-starter'); // This calls setValues(true, 'test-starter')
      
      expect(service.getStatus()).toBe(true);
    });

    it('should emit observable changes when values are set', (done) => {
      let emissionCount = 0;
      service.watch().subscribe(value => {
        emissionCount++;
        if (emissionCount === 1) {
          expect(value).toBe(true);
          done();
        }
      });
      
      service.on('test-starter'); // This triggers setValues() and observable emission
    });
  });

  describe('edge cases and error conditions', () => {
    it('should handle empty string starter for on()', () => {
      const result = service.on('');
      expect(result).toBe(true);
      expect(service.getStatus()).toBe(true);
    });

    it('should handle empty string starter for off()', () => {
      service.on('');
      const result = service.off('');
      expect(result).toBe(true);
      expect(service.getStatus()).toBe(false);
    });

    it('should handle very long starter strings', () => {
      const longStarter = 'a'.repeat(1000);
      const result = service.on(longStarter);
      expect(result).toBe(true);
      expect(service.getStatus()).toBe(true);
      
      const offResult = service.off(longStarter);
      expect(offResult).toBe(true);
      expect(service.getStatus()).toBe(false);
    });

    it('should handle special characters in starter string', () => {
      const specialStarter = 'test-starter-éáűőú-@#$%^&*()';
      const result = service.on(specialStarter);
      expect(result).toBe(true);
      expect(service.getStatus()).toBe(true);
      
      const offResult = service.off(specialStarter);
      expect(offResult).toBe(true);
      expect(service.getStatus()).toBe(false);
    });

    it('should handle null environment object', () => {
      (service as any).appEnv.environment = null;
      spyOn(console, 'log');
      
      const result = service.on('test-starter');
      expect(result).toBe(true);
      expect(console.log).not.toHaveBeenCalled();
    });

    it('should handle undefined debug property', () => {
      (service as any).appEnv.environment = {};
      spyOn(console, 'log');
      
      const result = service.on('test-starter');
      expect(result).toBe(true);
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('complete workflow scenarios', () => {
    it('should handle multiple on/off cycles correctly', () => {
      const starter = 'cycle-starter';
      
      // Cycle 1
      expect(service.on(starter)).toBe(true);
      expect(service.getStatus()).toBe(true);
      expect(service.off(starter)).toBe(true);
      expect(service.getStatus()).toBe(false);
      
      // Cycle 2
      expect(service.on(starter)).toBe(true);
      expect(service.getStatus()).toBe(true);
      expect(service.off(starter)).toBe(true);
      expect(service.getStatus()).toBe(false);
    });

    it('should handle concurrent spinner attempts', () => {
      const starter1 = 'starter1';
      const starter2 = 'starter2';
      const starter3 = 'starter3';
      
      // First spinner should succeed
      expect(service.on(starter1)).toBe(true);
      expect(service.getStatus()).toBe(true);
      
      // Other attempts should fail
      expect(service.on(starter2)).toBeUndefined();
      expect(service.on(starter3)).toBeUndefined();
      expect(service.getStatus()).toBe(true);
      
      // Wrong starters should not turn off
      expect(service.off(starter2)).toBeUndefined();
      expect(service.off(starter3)).toBeUndefined();
      expect(service.getStatus()).toBe(true);
      
      // Correct starter should turn off
      expect(service.off(starter1)).toBe(true);
      expect(service.getStatus()).toBe(false);
    });

    it('should handle ERROR_HANDLER override scenario', () => {
      const normalStarter = 'normal-starter';
      
      // Start with normal starter
      expect(service.on(normalStarter)).toBe(true);
      expect(service.getStatus()).toBe(true);
      
      // ERROR_HANDLER should override
      expect(service.off('ERROR_HANDLER')).toBe(true);
      expect(service.getStatus()).toBe(false);
      
      // Should be able to start new spinner after ERROR_HANDLER
      expect(service.on('new-starter')).toBe(true);
      expect(service.getStatus()).toBe(true);
    });
  });
});