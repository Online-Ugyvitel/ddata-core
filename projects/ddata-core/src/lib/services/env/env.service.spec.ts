import { TestBed } from '@angular/core/testing';
import { EnvService } from './env.service';

describe('EnvService', () => {
  let service: EnvService;

  describe('with env provided', () => {
    const mockEnvironment = {
      production: false,
      apiUrl: 'http://localhost:3000',
      featureFlags: {
        newFeature: true,
        betaFeature: false
      }
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          EnvService,
          { provide: 'env', useValue: mockEnvironment }
        ]
      });
      service = TestBed.inject(EnvService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should set environment from injected env', () => {
      expect(service.environment).toEqual(mockEnvironment);
    });

    it('should have public environment property accessible', () => {
      expect(service.environment.production).toBe(false);
      expect(service.environment.apiUrl).toBe('http://localhost:3000');
      expect(service.environment.featureFlags).toEqual({
        newFeature: true,
        betaFeature: false
      });
    });

    it('should maintain reference to the injected environment object', () => {
      expect(service.environment).toBe(mockEnvironment);
    });
  });

  describe('without env provided (undefined)', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          EnvService,
          { provide: 'env', useValue: undefined }
        ]
      });
      service = TestBed.inject(EnvService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should set environment to empty object when env is undefined', () => {
      expect(service.environment).toEqual({});
    });
  });

  describe('with null env provided', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          EnvService,
          { provide: 'env', useValue: null }
        ]
      });
      service = TestBed.inject(EnvService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should set environment to empty object when env is null', () => {
      expect(service.environment).toEqual({});
    });
  });

  describe('with empty object env provided', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          EnvService,
          { provide: 'env', useValue: {} }
        ]
      });
      service = TestBed.inject(EnvService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should set environment to provided empty object', () => {
      expect(service.environment).toEqual({});
    });
  });

  describe('with complex environment data', () => {
    const complexEnvironment = {
      production: true,
      version: 1.2,
      tags: ['tag1', 'tag2'],
      config: {
        nested: {
          value: 'test'
        }
      }
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          EnvService,
          { provide: 'env', useValue: complexEnvironment }
        ]
      });
      service = TestBed.inject(EnvService);
    });

    it('should handle complex environment objects', () => {
      expect(service.environment).toEqual(complexEnvironment);
      expect(service.environment.production).toBe(true);
      expect(service.environment.version).toBe(1.2);
      expect(service.environment.tags).toEqual(['tag1', 'tag2']);
      expect(service.environment.config.nested.value).toBe('test');
    });
  });
});
});