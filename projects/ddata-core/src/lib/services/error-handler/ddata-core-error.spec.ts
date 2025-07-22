import { DdataCoreError } from './ddata-core-error';

describe('DdataCoreError', () => {

  describe('Model Creation', () => {
    it('should throw error when created with no parameters', () => {
      expect(() => {
        new DdataCoreError();
      }).toThrow('Cannot read properties of undefined (reading \'error\')');
    });

    it('should throw error when created with undefined originalError', () => {
      expect(() => {
        new DdataCoreError(undefined);
      }).toThrow('Cannot read properties of undefined (reading \'error\')');
    });

    it('should throw error when created with null originalError', () => {
      expect(() => {
        new DdataCoreError(null);
      }).toThrow('Cannot read properties of null (reading \'error\')');
    });

    it('should create an instance with valid originalError', () => {
      const originalError = {
        error: {
          trace: []
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error).toBeTruthy();
      expect(error).toBeInstanceOf(DdataCoreError);
    });
  });

  describe('Property Initialization', () => {
    it('should initialize msg property to empty string', () => {
      const originalError = { error: {} };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
      expect(typeof error.msg).toBe('string');
    });

    it('should have originalError property accessible', () => {
      const originalError = { test: 'value', error: {} };
      const error = new DdataCoreError(originalError);
      
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('Constructor Logic - No Error Processing', () => {
    it('should throw error when originalError is undefined', () => {
      expect(() => {
        new DdataCoreError(undefined);
      }).toThrow('Cannot read properties of undefined (reading \'error\')');
    });

    it('should throw error when originalError is null', () => {
      expect(() => {
        new DdataCoreError(null);
      }).toThrow('Cannot read properties of null (reading \'error\')');
    });

    it('should not process when originalError is empty object', () => {
      const error = new DdataCoreError({});
      
      expect(error.msg).toBe('');
    });

    it('should not process when originalError.error is undefined', () => {
      const originalError = {
        error: undefined
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });

    it('should not process when originalError.error is null', () => {
      const originalError = {
        error: null
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });

    it('should not process when originalError.error is false', () => {
      const originalError = {
        error: false
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });

    it('should not process when originalError.error is empty string', () => {
      const originalError = {
        error: ''
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });

    it('should not process when originalError.error is 0', () => {
      const originalError = {
        error: 0
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });
  });

  describe('Constructor Logic - No Trace Processing', () => {
    it('should not process when originalError.error.trace is undefined', () => {
      const originalError = {
        error: {
          trace: undefined
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });

    it('should not process when originalError.error.trace is null', () => {
      const originalError = {
        error: {
          trace: null
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });

    it('should not process when originalError.error.trace is false', () => {
      const originalError = {
        error: {
          trace: false
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });

    it('should not process when originalError.error.trace is empty string', () => {
      const originalError = {
        error: {
          trace: ''
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });

    it('should not process when originalError.error.trace is 0', () => {
      const originalError = {
        error: {
          trace: 0
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });
  });

  describe('Constructor Logic - Empty Trace Array', () => {
    it('should process empty trace array without errors', () => {
      const originalError = {
        error: {
          trace: []
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });
  });

  describe('Constructor Logic - Trace Processing with Missing Properties', () => {
    it('should not process trace item when file is undefined', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: undefined,
              line: 123
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });

    it('should not process trace item when line is undefined', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: 'app/Http/Controllers/TestController.php',
              line: undefined
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });

    it('should not process trace item when both file and line are undefined', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: undefined,
              line: undefined
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });

    it('should not process trace item when file is null', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: null,
              line: 123
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });

    it('should not process trace item when line is null', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: 'app/Http/Controllers/TestController.php',
              line: null
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });
  });

  describe('Constructor Logic - Trace Processing with Non-Matching Files', () => {
    it('should not process trace item when file does not match controller pattern', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: 'app/Models/User.php',
              line: 123
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });

    it('should not process trace item when file is not a controller path', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: 'vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php',
              line: 456
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });

    it('should not process trace item when file contains similar but not exact controller path', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: 'app/Http/Middleware/TestMiddleware.php',
              line: 789
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });

    it('should not process trace item when file has different case', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: 'app/http/controllers/TestController.php',
              line: 123
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });
  });

  describe('Constructor Logic - Trace Processing with Matching Files', () => {
    it('should process trace item when file matches controller pattern', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: 'app/Http/Controllers/TestController.php',
              line: 123
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('app/Http/Controllers/TestController.php:123');
    });

    it('should process trace item with nested controller path', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: 'app/Http/Controllers/Admin/UserController.php',
              line: 456
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('app/Http/Controllers/Admin/UserController.php:456');
    });

    it('should process trace item with absolute controller path', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: '/var/www/html/app/Http/Controllers/ApiController.php',
              line: 789
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('/var/www/html/app/Http/Controllers/ApiController.php:789');
    });

    it('should process trace item with Windows-style controller path', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: 'C:\\projects\\myapp\\app\\Http\\Controllers\\HomeController.php',
              line: 101
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('C:\\projects\\myapp\\app\\Http\\Controllers\\HomeController.php:101');
    });
  });

  describe('Constructor Logic - Multiple Trace Items', () => {
    it('should process multiple matching trace items', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: 'app/Http/Controllers/FirstController.php',
              line: 123
            },
            {
              file: 'app/Http/Controllers/SecondController.php',
              line: 456
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('app/Http/Controllers/FirstController.php:123app/Http/Controllers/SecondController.php:456');
    });

    it('should process only matching trace items from mixed array', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: 'app/Models/User.php',
              line: 10
            },
            {
              file: 'app/Http/Controllers/TestController.php',
              line: 123
            },
            {
              file: 'vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php',
              line: 20
            },
            {
              file: 'app/Http/Controllers/AnotherController.php',
              line: 456
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('app/Http/Controllers/TestController.php:123app/Http/Controllers/AnotherController.php:456');
    });

    it('should handle trace items with missing properties in mixed array', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: 'app/Http/Controllers/FirstController.php',
              line: 123
            },
            {
              file: undefined,
              line: 456
            },
            {
              file: 'app/Http/Controllers/SecondController.php',
              line: undefined
            },
            {
              file: 'app/Http/Controllers/ThirdController.php',
              line: 789
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('app/Http/Controllers/FirstController.php:123app/Http/Controllers/ThirdController.php:789');
    });
  });

  describe('Constructor Logic - Edge Cases', () => {
    it('should throw error when trace item has non-string file', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: 123,
              line: 456
            }
          ]
        }
      };
      
      expect(() => {
        new DdataCoreError(originalError);
      }).toThrow('trace.file.match is not a function');
    });

    it('should throw error when trace item has null file', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: null,
              line: 456
            }
          ]
        }
      };
      
      expect(() => {
        new DdataCoreError(originalError);
      }).toThrow('Cannot read properties of null');
    });

    it('should throw error when trace item has object file', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: {},
              line: 456
            }
          ]
        }
      };
      
      expect(() => {
        new DdataCoreError(originalError);
      }).toThrow('trace.file.match is not a function');
    });

    it('should throw error when trace item has array file', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: [],
              line: 456
            }
          ]
        }
      };
      
      expect(() => {
        new DdataCoreError(originalError);
      }).toThrow('trace.file.match is not a function');
    });

    it('should throw error when trace item has boolean file', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: true,
              line: 456
            }
          ]
        }
      };
      
      expect(() => {
        new DdataCoreError(originalError);
      }).toThrow('trace.file.match is not a function');
    });

    it('should handle trace item with non-number line', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: 'app/Http/Controllers/TestController.php',
              line: 'not-a-number'
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('app/Http/Controllers/TestController.php:not-a-number');
    });

    it('should handle trace item with zero line number', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: 'app/Http/Controllers/TestController.php',
              line: 0
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('app/Http/Controllers/TestController.php:0');
    });

    it('should handle trace item with negative line number', () => {
      const originalError = {
        error: {
          trace: [
            {
              file: 'app/Http/Controllers/TestController.php',
              line: -5
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('app/Http/Controllers/TestController.php:-5');
    });

    it('should throw error when trace array that is not an array', () => {
      const originalError = {
        error: {
          trace: 'not-an-array'
        }
      };
      
      // This should throw an error since forEach is called on a non-array
      expect(() => {
        new DdataCoreError(originalError);
      }).toThrow('originalError.error.trace.forEach is not a function');
    });

    it('should handle trace array with non-object items', () => {
      const originalError = {
        error: {
          trace: [
            'string-item',
            123,
            null,
            {
              file: 'app/Http/Controllers/TestController.php',
              line: 123
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      // Only the valid object should be processed
      expect(error.msg).toBe('app/Http/Controllers/TestController.php:123');
    });
  });

  describe('Property Types and Access', () => {
    it('should have msg property of string type', () => {
      const originalError = { error: {} };
      const error = new DdataCoreError(originalError);
      
      expect(typeof error.msg).toBe('string');
    });

    it('should have originalError property accessible', () => {
      const originalError = { test: 'value', error: {} };
      const error = new DdataCoreError(originalError);
      
      expect(error.originalError).toBe(originalError);
      expect(error.hasOwnProperty('originalError') || 'originalError' in error).toBe(true);
    });

    it('should not allow originalError to be undefined in successful construction', () => {
      // Since undefined originalError throws an error, we test that it doesn't allow undefined
      expect(() => {
        new DdataCoreError(undefined);
      }).toThrow();
    });
  });

  describe('Integration Tests', () => {
    it('should handle complex Laravel-style error with multiple stack frames', () => {
      const originalError = {
        status: 500,
        error: {
          message: 'Internal Server Error',
          trace: [
            {
              file: '/var/www/html/vendor/laravel/framework/src/Illuminate/Foundation/Bootstrap/HandleExceptions.php',
              line: 254,
              function: 'Illuminate\\Foundation\\Bootstrap\\HandleExceptions->handleException'
            },
            {
              file: '/var/www/html/app/Http/Controllers/Api/UserController.php',
              line: 42,
              function: 'App\\Http\\Controllers\\Api\\UserController->store',
              class: 'App\\Http\\Controllers\\Api\\UserController'
            },
            {
              file: '/var/www/html/vendor/laravel/framework/src/Illuminate/Routing/Controller.php',
              line: 54,
              function: 'call_user_func_array'
            },
            {
              file: '/var/www/html/app/Http/Controllers/Admin/AdminController.php',
              line: 78,
              function: 'App\\Http\\Controllers\\Admin\\AdminController->index'
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('/var/www/html/app/Http/Controllers/Api/UserController.php:42/var/www/html/app/Http/Controllers/Admin/AdminController.php:78');
    });

    it('should handle realistic error with no controller traces', () => {
      const originalError = {
        status: 500,
        error: {
          message: 'Database connection error',
          trace: [
            {
              file: '/var/www/html/vendor/laravel/framework/src/Illuminate/Database/Connection.php',
              line: 678,
              function: 'PDO->prepare'
            },
            {
              file: '/var/www/html/vendor/laravel/framework/src/Illuminate/Database/Eloquent/Model.php',
              line: 1234,
              function: 'Illuminate\\Database\\Eloquent\\Model->save'
            },
            {
              file: '/var/www/html/app/Models/User.php',
              line: 89,
              function: 'App\\Models\\User->create'
            }
          ]
        }
      };
      const error = new DdataCoreError(originalError);
      
      expect(error.msg).toBe('');
    });
  });
});