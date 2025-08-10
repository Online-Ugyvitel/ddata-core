# DData Core - AI Agent Instructions

**ddata-core** is an Angular library providing comprehensive data management services, models, and components. This document contains AI-optimized reference documentation for GitHub Copilot coding agents.

## Package Information

- **Package Name**: `ddata-core`
- **Version**: `0.3.16`
- **Description**: DData Core module, models & services
- **Keywords**: angular, localstorage, remote storage, proxy, service, data service
- **Repository**: https://github.com/netdjw/ddata-core

## Installation

```bash
npm install ddata-core --save
```

## Module Configuration

### Basic Setup

```typescript
import { DdataCoreModule } from 'ddata-core';

@NgModule({
  imports: [
    DdataCoreModule.forRoot(environment)
  ],
})
export class AppModule { }
```

### Dependencies

**Peer Dependencies:**
- `@angular/common`: >=13.2.3
- `@angular/core`: >=13.2.3  
- `pluralize`: ^8.0.0

**Runtime Dependencies:**
- `@angular/router`: ^20.0.6
- `rxjs`: ^7.8.2
- `tslib`: ^2.0.0

## Why Use DData Core?

Almost every project needs to:
- **Fetch data from backend** - Handle HTTP requests and responses
- **Store data in LocalStorage** - Cache data locally for offline access
- **Keep sync between local and remote storage** - Automatically decide when to use local vs remote data
- **Convert plain JSON objects to typed models** - Prevent undefined/null errors and enable type safety
- **Show loading spinners** - Provide user feedback during data operations
- **Validate data before saving** - Ensure data integrity and user input validation
- **Handle errors gracefully** - Present error messages in a user-friendly way

**DData Core solves all these problems with a clean, layered architecture that eliminates boilerplate code and common bugs.**

## How It Helps Avoid Common Errors

### 1. Prevents Undefined/Null Errors

**Common Problem:**
```typescript
// This often fails with "Cannot read property 'name' of undefined"
const userName = response.user.name;
```

**DData Core Solution:**
```typescript
// Models initialize all fields with default values
export class User extends BaseModel {
  name: string;
  
  init(data: any = null): User {
    data = !!data ? data : {};
    this.name = !!data.name ? data.name : ''; // Never undefined
    return this;
  }
}

// Always safe to access
const user = new User().init(response.user);
const userName = user.name; // Always defined, never null
```

### 2. Eliminates Type Errors

**Common Problem:**
```typescript
// Runtime errors when backend returns unexpected types
const userId = response.user_id; // Could be string, number, or null
```

**DData Core Solution:**
```typescript
init(data: any = null): User {
  this.id = !!data.id ? Number(data.id) : 0; // Always number
  return this;
}
```

### 3. Reduces Code Duplication

**Without DData Core:**
```typescript
// Repeated in every service
getData() {
  this.spinner.show();
  return this.http.get('/api/users').pipe(
    finalize(() => this.spinner.hide()),
    catchError(this.handleError.bind(this))
  );
}
```

**With DData Core:**
```typescript
// Single line, handles spinner and errors automatically
const proxy = new ProxyService<User>(new User());
proxy.getAll().subscribe(data => {
  // Data is already typed, validated, and spinner is handled
});
```

## Core Architecture

The library follows a clean layered architecture where each layer has specific responsibilities:

```
+--------------------+                   +------------------------+
| Angular HttpClient |                   | Browser's LocalStorage |
+--------------------+                   +------------------------+
        ||                                            ||
        ||                                   +----------------+
        ||                                   | StorageService |
        ||                                   +----------------+
        ||                                            ||
+-------------------+                       +------------------+
| RemoteDataService |                       | LocalDataService | 
+-------------------+                       +------------------+
          \\                                        //
           \\                                      //    
        +-----------------------------------------------+
        |                  ProxyService                 |
        +-----------------------------------------------+
                               ||
                       +---------------+            +-----------------+
                       | HelperService | ========== | Spinner Service |
                       +---------------+            +-----------------+
                               ||
                      +--------------------+
                      | Abstract Component |
                      +--------------------+
                               ||
                     +----------------------+
                     | Your Final Component |
                     +----------------------+
```

### Layer Responsibilities

1. **StorageService**: Direct LocalStorage interface with Observable notifications
2. **LocalDataService**: Converts LocalStorage strings to models, provides memory caching
3. **RemoteDataService**: HTTP communication, JSON-to-model conversion, error handling
4. **ProxyService**: **Intelligent decision layer** - automatically chooses local vs remote data
5. **HelperService**: High-level operations with automatic spinner control
6. **SpinnerService**: Modal overlay management during operations
7. **Abstract Components**: Reusable component patterns

## Models

### BaseModel

**Why use BaseModel instead of plain objects or interfaces?**

BaseModel eliminates the most common JavaScript error: `"Cannot read property '...' of undefined"`. It ensures all properties are always defined with sensible default values, provides type safety, and includes validation and serialization capabilities.

**How BaseModel prevents errors:**

1. **Guaranteed Property Initialization**: Every property gets a default value
2. **Type Safety**: Automatic type conversion and validation
3. **Null/Undefined Protection**: Explicit handling of missing data
4. **Validation**: Built-in validation rules with error collection
5. **Serialization**: Automatic conversion between JSON and model instances

### BaseModel Structure

Every model extending BaseModel must define these properties:

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `api_endpoint` | string | Yes | N/A | API endpoint URI, must start with `/` |
| `model_name` | string | Yes | `'NotDefined'` | Unique model identifier for the application |
| `use_localstorage` | boolean | No | `false` | Enable automatic local storage caching |
| `id` | ID | No | `0` | Unique identifier (0 = new record) |
| `validationRules` | object | No | `{}` | Validation rules for model fields |
| `fields` | object | No | `{}` | UI field definitions and translations |

### Complete Model Example

```typescript
import { BaseModel, ID, ISODate, FieldContainerInterface, ValidationRuleInterface } from 'ddata-core';

export interface UserUIFieldsInterface {
  name: string;
  email: string;
  phone: string;
}

export interface UserInterface extends UserUIFieldsInterface {
  id: ID;
  created_at: ISODate;
  is_active: boolean;
}

export class User extends BaseModel implements UserInterface {
  // Required BaseModel properties
  readonly api_endpoint = '/api/users';
  readonly model_name = 'User';
  readonly use_localstorage = false;
  
  // Model properties
  id: ID;
  name: string;
  email: string;
  phone: string;
  created_at: ISODate;
  is_active: boolean;

  // Validation rules with comprehensive examples
  validationRules: ValidationRuleInterface = {
    name: ['required', 'string', 'min:2', 'max:100'],
    email: ['required', 'email'],
    phone: ['nullable', 'string', 'regex:/^[+]?[0-9\\s\\-\\(\\)]+$/']
  };

  // UI field definitions for forms and components
  fields: FieldContainerInterface<UserUIFieldsInterface> = {
    name: {
      title: 'Full Name',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true
    },
    email: {
      title: 'Email Address',
      label: 'Email',
      placeholder: 'your.email@example.com',
      required: true
    },
    phone: {
      title: 'Phone Number',
      label: 'Phone',
      placeholder: '+1 (555) 123-4567',
      required: false
    }
  };

  /**
   * Initialize model with data, handling undefined/null values
   * This method MUST handle all possible undefined/null scenarios
   */
  init(data: any = null): User {
    // Always ensure data is an object
    data = !!data ? data : {};

    // Initialize each field with proper type checking and defaults
    this.id = !!data.id ? Number(data.id) : 0;
    this.name = !!data.name ? String(data.name) : '';
    this.email = !!data.email ? String(data.email) : '';
    this.phone = !!data.phone ? String(data.phone) : '';
    this.created_at = !!data.created_at ? data.created_at : '';
    this.is_active = !!data.is_active ? Boolean(data.is_active) : true;

    return this;
  }

  /**
   * Prepare model data for API transmission
   * Only include fields that should be sent to backend
   */
  prepareToSave(): any {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      is_active: this.is_active
      // Note: created_at is typically not sent in updates
    };
  }
}
```

### Error Prevention in Action

**Before (Plain Objects - Error Prone):**
```typescript
// Backend response might be incomplete
const response = { user: { name: 'John' } }; // Missing email, phone

// This will throw "Cannot read property 'email' of undefined"
const userEmail = response.user.email.toLowerCase();

// This will throw "Cannot read property 'length' of undefined"  
if (response.user.phone.length > 0) { ... }
```

**After (BaseModel - Error Safe):**
```typescript
// Same incomplete response
const response = { user: { name: 'John' } };

// Always safe - email is initialized to empty string
const user = new User().init(response.user);
const userEmail = user.email.toLowerCase(); // Safe: ''
if (user.phone.length > 0) { ... } // Safe: phone is ''
```

#### BaseModel Methods

**Core Methods:**
- `init(data?: any): T` - Initialize model from data, handle undefined/null values
- `prepareToSave(): any` - Prepare data for persistence (removes computed fields)
- `validate(): void` - Validate model against rules, populate `validationErrors`
- `isValid(): boolean` - Check if model passes all validation rules

**Default Values Behavior:**
- **Numbers**: Default to `0`
- **Strings**: Default to `''` (empty string)
- **Booleans**: Default to `false` (unless specified otherwise)
- **Arrays**: Default to `[]` (empty array)
- **Objects**: Default to `{}` (empty object)
- **Dates**: Default to `''` or current date depending on field type
- `getValidatedErrorFields(): Array<string>` - Get validation error field names

**Date Utilities:**
- `getCurrentISODate(): ISODate` - Current date as YYYY-MM-DD
- `toISODate(date: Date): ISODate` - Convert Date to YYYY-MM-DD
- `toISODatetime(date: Date): string` - Convert Date to YYYY-MM-DD HH:mm:ss
- `setDate(date: Date, days: number): ISODate` - Add days to date
- `calculateDateWithoutWeekend(date: string, days: number, sequence: 'up' | 'down'): ISODate`

**Field Initialization:**
- `fieldAsString(field: string, defaultValue: string, data: unknown): void`
- `fieldAsNumber(field: string, defaultValue: number, data: unknown): void`
- `fieldAsBoolean(field: string, defaultValue: boolean, data: unknown): void`
- `initAsString(fields: Partial<T>, data: unknown): void`
- `initAsNumber(fields: Partial<T>, data: unknown): void`
- `initAsBoolean(fields: Partial<T>, data: unknown): void`

**Validation Rules:**
Available validation rules: `string`, `boolean`, `number`, `integer`, `required`, `nullable`, `name`, `email`, `domain`, `url`, `iso_date`, `driving_licence`, `id_card_number`, `address_card_number`, `phonenumber`, `bankaccount`, `taxnumber`, `social_insurance_number`, `not_zero`, `lang`, `register_number`, `array`, `not_empty`, `empty`, `person_taxnumber`, `color_code`, `iban_code`, `swift_code`

### Paginate Model

For paginated data management (Laravel-style pagination).

```typescript
import { PaginateInterface, Paginate } from 'ddata-core';

const paginate: PaginateInterface = {
  current_page: 1,
  per_page: 15,
  from: 1,
  to: 15,
  data: [], // Array of models
  total: 100,
  last_page: 7
};

// Create paginated response
const paginateModel = new Paginate(userModel);
```

### Selectable Interface

For components that need selection capabilities.

```typescript
import { SelectableInterface } from 'ddata-core';

export class SelectableUser implements SelectableInterface {
  selected: boolean = false;
  // ... other properties
}
```

### File Upload Interface

```typescript
import { FileUploadProcessInterface } from 'ddata-core';

const uploadProcess: FileUploadProcessInterface = {
  remoteFileDatas: null, // Will contain response data when complete
  file: 'filename.jpg',
  progress: Observable<number> // Upload progress percentage
};
```

## Services

### Why Use DData Core Services Instead of Custom Implementation?

**1. Eliminates Boilerplate Code**
- No need to write HTTP error handling repeatedly
- Automatic spinner management
- Built-in caching logic
- Consistent API patterns across your application

**2. Reduces Common Bugs**
- Automatic model initialization prevents undefined errors
- Consistent error handling patterns
- Type-safe operations
- Memory management for local storage

**3. Provides Advanced Features**
- Automatic local/remote data switching
- Observable-based reactive updates
- Batch operations support
- File upload with progress tracking

### StorageService

**Why use StorageService?**
Direct localStorage access doesn't provide reactive updates or change notifications. StorageService adds Observable streams to localStorage operations, enabling reactive patterns and automatic UI updates when storage changes.

**Responsibilities:**
- Store and remove items from LocalStorage
- Clear LocalStorage  
- Provide Observable to listen and react to localStorage changes
- Handle localStorage quota exceeded errors

**Default Behavior:**
- All operations are synchronous except for the change notifications
- Items are stored as strings (JSON.stringify/parse handled by higher layers)
- Emits change notifications on every modification
- Gracefully handles storage quota exceeded scenarios

```typescript
import { StorageService } from 'ddata-core';

@Injectable()
export class MyService {
  constructor(private storage: StorageService) {}

  // Watch storage changes - useful for multi-tab synchronization
  watchChanges() {
    this.storage.watchStorage().subscribe(changed => {
      console.log('Storage changed - refresh UI');
      // Automatically sync data across browser tabs
    });
  }

  // Store data
  saveData() {
    this.storage.setItem('user_preferences', JSON.stringify(data));
  }

  // Get data
  getData(): string | null {
    return this.storage.getItem('user_preferences');
  }

  // Remove specific item
  removeData() {
    this.storage.removeItem('user_preferences');
  }

  // Clear all storage
  clearAll() {
    this.storage.clear();
  }
}
```

### LocalDataService

**Why use LocalDataService instead of direct localStorage?**
LocalDataService converts localStorage strings to typed models automatically, provides memory caching, and handles array operations safely. It prevents JSON parsing errors and ensures data consistency.

**Dependencies:** Requires StorageService
**Responsibilities:**
- Convert LocalStorage strings to models
- Provide memory caching with Observable streams
- Handle model arrays safely
- Manage localStorage keys automatically

**How it helps avoid errors:**
```typescript
// Without LocalDataService - Error prone
const data = JSON.parse(localStorage.getItem('users')); // Might be null
const user = data[0]; // Might be undefined
const name = user.name; // Runtime error

// With LocalDataService - Safe
const users = localService.allFromLocal(); // Always array of User models
const user = users[0]; // Either User model or undefined (handled safely)
const name = user?.name || ''; // Safe access
```

**Default Values:**
- Returns empty array `[]` when no data exists
- Initializes all models with their default values
- Automatically handles malformed JSON data

```typescript
import { LocalDataService } from 'ddata-core';

export class UserLocalService extends LocalDataService<User> {
  constructor() {
    super(new User()); // Pass model instance for type inference
  }
}

// Usage
const localService = new LocalDataService<User>(new User());

// Get all items (always returns array, never null)
const users: User[] = localService.allFromLocal(); // Default: []

// Get single item by ID
const user: User | undefined = localService.getOneFromLocal(42);

// Save single item
const newUser = new User().init({ name: 'John', email: 'john@example.com' });
localService.saveToLocal(newUser);

// Save multiple items
localService.saveCollectionToLocal([user1, user2, user3]);

// Remove by ID
localService.deleteFromLocal(42);

// Get with Observable (reactive updates)
localService.getDataFromLocalAsObservable().subscribe(users => {
  // Automatically updates when localStorage changes
  console.log('Users updated:', users);
});

// Check if data exists
const hasUsers = localService.hasDataInLocal(); // Returns boolean
```

### RemoteDataService

**Why use RemoteDataService instead of Angular HttpClient?**
RemoteDataService provides automatic model conversion, standardized error handling, pagination support, and file upload capabilities. It eliminates repetitive HTTP boilerplate and ensures consistent API interactions.

**Dependencies:** Requires Angular HttpClient
**Responsibilities:**
- Communicate with backend over HTTP
- Convert incoming JSON to models automatically
- Convert outgoing models to JSON via `prepareToSave()`
- Handle errors with standardized error responses
- Support Laravel-style pagination
- Manage file uploads with progress tracking

**Default Behaviors:**
- Automatically adds authentication headers if configured
- Converts all responses to model instances
- Validates models before saving (calls `validate()`)
- Uses model's `api_endpoint` for URL construction
- Handles both single items and collections

**URL Construction Pattern:**
- `getAll()`: `{apiUrl}/{model.api_endpoint}`
- `getOne(id)`: `{apiUrl}/{model.api_endpoint}/{id}`
- `save()`: POST to `{apiUrl}/{model.api_endpoint}` (new) or PUT to `{apiUrl}/{model.api_endpoint}/{id}` (update)
- `delete()`: DELETE to `{apiUrl}/{model.api_endpoint}/{id}`

```typescript
import { RemoteDataService } from 'ddata-core';

export class UserRemoteService extends RemoteDataService<User> {
  constructor(http: HttpClient) {
    super(http, new User());
  }
}

// Usage
const remoteService = new RemoteDataService<User>(http, new User());

// Get paginated data (Laravel-style pagination)
remoteService.getAll().subscribe(paginate => {
  paginate.data.forEach(user => {
    // Each user is a fully initialized User model
    console.log(user.name); // Always safe to access
  });
});

// Get all without pagination
remoteService.getAllWithoutPaginate().subscribe(users => {
  // Array of User models
});

// Get single item
remoteService.getOne(42).subscribe(user => {
  // Fully initialized User model
});

// Save (automatically chooses POST vs PUT based on model.id)
const newUser = new User().init({ name: 'John', email: 'john@example.com' });
remoteService.save(newUser).subscribe(result => {
  // Result is either ID (number) or boolean
});

// Delete single
remoteService.delete(user).subscribe(result => {
  // HTTP status code
});

// Delete multiple
remoteService.deleteMultiple([user1, user2]).subscribe(result => {
  // Batch delete response
});

// Custom endpoints
remoteService.getUri('/users/active').subscribe(users => {
  // Custom API endpoint
});

// File upload with progress
const files = new Set<File>([file1, file2]);
const additionalData = { folder_id: 123 };
remoteService.sendFiles('/files', 0, files, additionalData).subscribe(processes => {
  processes.forEach(process => {
    process.progress.subscribe(percent => {
      console.log(`Upload progress: ${percent}%`);
    });
  });
});
```

### ProxyService - The Intelligent Data Layer

**Why use ProxyService instead of RemoteDataService or LocalDataService directly?**

ProxyService is the **most important service** in ddata-core. It's an intelligent decision layer that automatically determines whether to use local or remote data based on model configuration and data availability. This eliminates manual decision-making and provides seamless offline/online data access.

**Dependencies:** 
- LocalDataService (for local storage operations)
- RemoteDataService (for API operations)

**Key Benefits:**
1. **Automatic Local/Remote Switching**: Decides based on model's `use_localstorage` setting
2. **Offline Support**: Falls back to local data when API is unavailable
3. **Data Synchronization**: Keeps local and remote data in sync automatically
4. **Performance Optimization**: Uses local data for faster initial loads
5. **Simplified API**: Single interface for all data operations

**How it works:**
- For models with `use_localstorage: true`: Loads from local first, then syncs with remote
- For models with `use_localstorage: false`: Always uses remote data
- Automatically handles network failures by falling back to local data
- Provides the same API regardless of data source

**Decision Logic:**
```typescript
// Model configuration determines behavior
export class User extends BaseModel {
  readonly use_localstorage = true; // ProxyService will use local storage
}

export class SystemLog extends BaseModel {
  readonly use_localstorage = false; // ProxyService will always use remote
}
```

**Complete ProxyService Example:**

```typescript
import { ProxyService } from 'ddata-core';

// Create typed proxy service
export class UserProxyService extends ProxyService<User> {
  constructor() {
    super(new User()); // Model instance provides type and configuration
  }
  
  // Custom methods can be added here
  getActiveUsers(): Observable<User[]> {
    return this.getAllWithoutPaginate().pipe(
      map(users => users.filter(user => user.is_active))
    );
  }
}

// Or use directly
const userProxy = new ProxyService<User>(new User());

// All operations use the same API regardless of local/remote decision
userProxy.getAll().subscribe(paginate => {
  // Data comes from local OR remote based on model.use_localstorage
  paginate.data.forEach(user => {
    console.log(user.name); // Always safe, always initialized
  });
});

// Save operations automatically sync local and remote
const newUser = new User().init({ name: 'John', email: 'john@example.com' });
userProxy.save(newUser).subscribe(result => {
  // Saved to remote AND local (if use_localstorage: true)
  // Failed remote saves are queued for retry
});

// Get single item with intelligent caching
userProxy.getOne(42).subscribe(user => {
  // Local first if available, remote as backup
  // Result cached locally for future access
});
```

**Intelligent Behavior Examples:**

```typescript
// Model with local storage enabled
export class UserPreference extends BaseModel {
  readonly use_localstorage = true;
  readonly api_endpoint = '/api/user-preferences';
}

const prefProxy = new ProxyService<UserPreference>(new UserPreference());

// First call: Loads from localStorage (instant), then syncs with API
prefProxy.getAll().subscribe(data => {
  // Immediate response from localStorage
  console.log('Cached preferences:', data);
});

// API response automatically updates local storage and emits new data
// No additional code needed for synchronization

// Save operation: Saves to both local and remote
prefProxy.save(preference).subscribe(result => {
  // Saved locally immediately (optimistic update)
  // Saved to remote in background
  // If remote fails, queued for retry when connection restored
});
```

```typescript
// Model without local storage
export class AuditLog extends BaseModel {
  readonly use_localstorage = false; // Always fetch from server
  readonly api_endpoint = '/api/audit-logs';
}

const logProxy = new ProxyService<AuditLog>(new AuditLog());

// Always fetches from remote
logProxy.getAll().subscribe(logs => {
  // Fresh data from API every time
  // No local caching (appropriate for audit logs)
});
```

**Error Handling and Fallbacks:**

```typescript
// ProxyService automatically handles network failures
userProxy.getAll().subscribe({
  next: (data) => {
    // Success: data from remote or local fallback
  },
  error: (error) => {
    // Only fires if both remote AND local fail
    console.error('No data available:', error);
  }
});
```

### Helper Service

**Why use HelperService?**
HelperService provides the highest level of abstraction, combining ProxyService operations with automatic spinner management and navigation. It eliminates the need to manage loading states manually.

**Dependencies:**
- ProxyService (for data operations)
- SpinnerService (for loading indicators)
- Router (for navigation)

**Responsibilities:**
- Automatic spinner show/hide during operations
- Navigation after successful operations
- Error handling with user-friendly messages
- Observable emissions for reactive UI updates

```typescript
import { HelperService } from 'ddata-core';

export class UserHelperService extends HelperService<User> {
  constructor(proxy: ProxyService<User>, spinner: SpinnerService, router: Router) {
    super(proxy, spinner, router);
  }
}

// Usage - completely automated
const userHelper = new HelperService<User>(userProxy, spinner, router);

// Automatic spinner + data loading + error handling
userHelper.loadAll().subscribe(users => {
  // Spinner automatically shown/hidden
  // Data is fully loaded and processed
  // Errors are handled automatically
});
```

### SpinnerService

**Why use SpinnerService instead of custom loading indicators?**
SpinnerService provides centralized loading state management with modal overlay support. It prevents users from interacting with the UI during operations and provides consistent loading experience across the application.

**Responsibilities:**
- Show/hide modal overlay during operations
- Prevent user interaction during loading
- Support for custom loading messages
- Automatic timeout handling for long operations

**Default Behavior:**
- Creates modal overlay that covers entire viewport
- Shows configurable spinner/loading animation
- Blocks all user interactions until hidden
- Supports custom messages and themes

```typescript
import { SpinnerService } from 'ddata-core';

@Injectable()
export class MyService {
  constructor(private spinner: SpinnerService) {}

  loadData() {
    // Manual spinner control
    this.spinner.show('Loading users...');
    
    this.dataService.getUsers().subscribe({
      next: (users) => {
        this.spinner.hide();
        // Process users
      },
      error: (error) => {
        this.spinner.hide();
        // Handle error
      }
    });
  }

  // Better: Use with automatic management via HelperService
  // (shown in previous examples)
}
```

### Notification Service

**Why use NotificationService?**
Provides standardized user notifications with different severity levels, automatic dismissal, and consistent styling across the application.

```typescript
import { NotificationService } from 'ddata-core';

@Injectable()
export class MyService {
  constructor(private notification: NotificationService) {}

  showMessages() {
    // Success notification
    this.notification.success('User saved successfully!');
    
    // Error notification
    this.notification.error('Failed to save user');
    
    // Warning notification
    this.notification.warning('Please check your input');
    
    // Info notification
    this.notification.info('Loading in progress...');
  }
}
```

### Validator Service

**Why use ValidatorService?**
Provides comprehensive validation with 60+ built-in rules, custom rule support, and automatic error message generation.

**Available Validation Rules (60+):**
- **Basic**: `required`, `nullable`, `string`, `boolean`, `number`, `integer`
- **String**: `min:n`, `max:n`, `regex:pattern`, `name`, `empty`, `not_empty`
- **Numeric**: `not_zero`, `between:min,max`
- **Format**: `email`, `url`, `domain`, `iso_date`, `color_code`
- **Hungarian Specific**: `driving_licence`, `id_card_number`, `address_card_number`, `phonenumber`, `bankaccount`, `taxnumber`, `social_insurance_number`, `person_taxnumber`, `register_number`
- **Financial**: `iban_code`, `swift_code`
- **Arrays**: `array`, `lang`

```typescript
import { ValidatorService } from 'ddata-core';

@Injectable()
export class MyService {
  constructor(private validator: ValidatorService) {}

  validateUser(user: User) {
    const rules = {
      name: ['required', 'string', 'min:2', 'max:100'],
      email: ['required', 'email'],
      age: ['required', 'integer', 'between:18,120'],
      phone: ['nullable', 'phonenumber'],
      website: ['nullable', 'url']
    };

    const isValid = this.validator.validate(user, rules);
    
    if (!isValid) {
      const errors = this.validator.getErrors();
      console.log('Validation errors:', errors);
    }
  }
}
```

### Sorter Service

**Why use SorterService?**
Provides consistent sorting across the application with support for complex sorting scenarios, locale-aware sorting, and custom sort functions.

```typescript
import { SorterService } from 'ddata-core';

@Injectable()
export class MyService {
  constructor(private sorter: SorterService) {}

  sortData() {
    const users: User[] = [...]; // Your user array

    // Sort by single field
    const sortedByName = this.sorter.sort(users, 'name');
    
    // Sort by multiple fields
    const sortedByNameAndAge = this.sorter.sort(users, ['name', 'age']);
    
    // Custom sort function
    const customSorted = this.sorter.sort(users, (a, b) => {
      return a.created_at.localeCompare(b.created_at);
    });
  }
}
```

## Complete Service Integration Example

**Here's how all services work together in a real-world scenario:**

```typescript
// 1. Define your model with local storage enabled
export class Task extends BaseModel {
  readonly api_endpoint = '/api/tasks';
  readonly model_name = 'Task';
  readonly use_localstorage = true; // Enable intelligent caching

  id: ID;
  title: string;
  description: string;
  completed: boolean;
  due_date: ISODate;

  validationRules = {
    title: ['required', 'string', 'min:3', 'max:100'],
    due_date: ['required', 'iso_date']
  };

  init(data: any = null): Task {
    data = !!data ? data : {};
    this.id = !!data.id ? Number(data.id) : 0;
    this.title = !!data.title ? String(data.title) : '';
    this.description = !!data.description ? String(data.description) : '';
    this.completed = !!data.completed ? Boolean(data.completed) : false;
    this.due_date = !!data.due_date ? data.due_date : '';
    return this;
  }

  prepareToSave(): any {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      due_date: this.due_date
    };
  }
}

// 2. Create service that uses ProxyService for intelligent data management
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private proxy = new ProxyService<Task>(new Task());
  private helper = new HelperService<Task>(this.proxy, this.spinner, this.router);

  constructor(
    private spinner: SpinnerService,
    private router: Router,
    private notification: NotificationService,
    private validator: ValidatorService
  ) {}

  // Load tasks with automatic local/remote intelligence
  loadTasks(): Observable<Task[]> {
    return this.proxy.getAllWithoutPaginate().pipe(
      // Data automatically comes from:
      // 1. Local storage first (instant response)
      // 2. Then API sync (background update)
      // 3. Or API only if no local data
      tap(tasks => {
        console.log(`Loaded ${tasks.length} tasks`);
        // All tasks are fully initialized Task models
        // No undefined errors possible
      })
    );
  }

  // Save with comprehensive validation and error handling
  saveTask(task: Task): Observable<any> {
    // Validate before saving
    if (!this.validator.validate(task, task.validationRules)) {
      const errors = this.validator.getErrors();
      this.notification.error(`Validation failed: ${errors.join(', ')}`);
      return throwError(errors);
    }

    // Use helper for automatic spinner and navigation
    return this.helper.save(task, '/tasks').pipe(
      // Automatic behaviors:
      // 1. Spinner shows during save
      // 2. Saves to local storage immediately (optimistic)
      // 3. Saves to remote API
      // 4. If remote fails, queues for retry
      // 5. Navigates to /tasks on success
      // 6. Shows error notification on failure
      tap(result => {
        this.notification.success('Task saved successfully!');
      }),
      catchError(error => {
        this.notification.error('Failed to save task');
        return throwError(error);
      })
    );
  }

  // Search and sort with intelligent caching
  searchTasks(query: string): Observable<Task[]> {
    return this.loadTasks().pipe(
      map(tasks => tasks.filter(task => 
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.description.toLowerCase().includes(query.toLowerCase())
      )),
      // Data comes from cache if available, no API call needed
      map(filtered => this.sorter.sort(filtered, 'due_date'))
    );
  }

  // Complete task with optimistic updates
  completeTask(task: Task): Observable<any> {
    task.completed = true;
    
    return this.proxy.save(task).pipe(
      // Automatically updates local storage immediately
      // Syncs with remote in background
      tap(() => {
        this.notification.success('Task completed!');
      })
    );
  }
}

// 3. Use in component - all complexity abstracted away
@Component({
  selector: 'app-task-list',
  template: `
    <div *ngFor="let task of tasks">
      <h3>{{ task.title }}</h3>
      <p>{{ task.description }}</p>
      <button (click)="completeTask(task)" [disabled]="task.completed">
        {{ task.completed ? 'Completed' : 'Mark Complete' }}
      </button>
    </div>
  `
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    // Single line loads data with full intelligence
    this.taskService.loadTasks().subscribe(tasks => {
      this.tasks = tasks;
      // Tasks are always Task models, never undefined
      // Local data loads instantly, remote syncs in background
      // Offline functionality works automatically
    });
  }

  completeTask(task: Task) {
    // Single line with full error handling, validation, and sync
    this.taskService.completeTask(task).subscribe();
    // No spinner management needed
    // No error handling needed
    // No loading state management needed
    // No offline handling needed
  }
}
```

This example shows how DData Core eliminates hundreds of lines of boilerplate code while providing enterprise-grade features like offline support, optimistic updates, automatic validation, and intelligent caching.

### Proxy Service

Unified service that switches between local and remote storage based on model configuration.

```typescript
import { ProxyService } from 'ddata-core';

const proxy = new ProxyService<User>(new User());

// Same interface as Remote/Local services
proxy.getAll().subscribe((paginate: PaginateInterface) => {
  // Automatically uses local or remote based on model.use_localstorage
});

proxy.save(user).subscribe((id: number) => {
  // Saves to appropriate storage
});

// Search functionality
proxy.search(filterData, pageNumber).subscribe((results: PaginateInterface) => {
  // Search results
});

proxy.searchWithoutPaginate(filterData).subscribe((results: Array<User>) => {
  // Search without pagination
});
```

### Validator Service

Comprehensive validation service with built-in rules.

```typescript
import { ValidatorService } from 'ddata-core';

@Injectable()
export class MyService {
  constructor(private validator: ValidatorService) {}

  validateData() {
    const data = { email: 'invalid-email', name: '' };
    const rules = { 
      email: ['required', 'email'],
      name: ['required', 'string'] 
    };

    try {
      const [isValid, errors] = this.validator.validateObject(data, rules, true, {
        message: 'Validation failed'
      });
      
      if (!isValid) {
        console.log('Validation errors:', errors);
      }
    } catch (error) {
      // Handle validation error
    }
  }
}
```

### Notification Service

Toast-style notification management.

```typescript
import { NotificationService, NotificationType } from 'ddata-core';

@Injectable()
export class MyService {
  constructor(private notifications: NotificationService) {}

  showSuccess() {
    this.notifications.add('Success', 'Operation completed', 'success');
  }

  showError() {
    this.notifications.add('Error', 'Something went wrong', 'danger');
  }

  showValidationError(model: BaseModelInterface<any>) {
    this.notifications.showValidationError(model);
  }

  // Watch notifications
  watchNotifications() {
    this.notifications.watch().subscribe(notifications => {
      // Handle notification updates
    });
  }
}
```

**Notification Types:** `success`, `info`, `warning`, `danger`

### Spinner Service

Loading state management.

```typescript
import { SpinnerService } from 'ddata-core';

@Injectable()
export class MyService {
  constructor(private spinner: SpinnerService) {}

  async loadData() {
    this.spinner.on('loading-users');
    
    try {
      const data = await this.fetchData();
      return data;
    } finally {
      this.spinner.off('loading-users');
    }
  }

  // Watch spinner state
  watchSpinner() {
    this.spinner.watch().subscribe(isLoading => {
      console.log('Loading:', isLoading);
    });
  }
}
```

### Helper Service

High-level operations combining multiple services.

```typescript
import { HelperService } from 'ddata-core';

const helper = new HelperService<User>(new User());

// Get one with automatic loading states
helper.getOne(user, isModal).subscribe(success => {
  // Model populated with data
});

// Save with navigation and loading
helper.save(user, isModal, emitter, saveBackend, navigateAfterSuccess).subscribe(success => {
  // Save completed
});

// Boolean field toggle
helper.booleanChange(user, 'active').subscribe(success => {
  // Field toggled and saved
});

// Delete with confirmation
helper.delete(user, componentReference).subscribe(success => {
  // Delete completed
});

// Pagination
helper.changeToPage(2, paginate, models).subscribe(success => {
  // Page changed
});

// Search
helper.search(filterData, pageNumber).subscribe(results => {
  // Search completed
});
```

### Sorter Service

Array sorting utility.

```typescript
import { SorterService } from 'ddata-core';

const sorter = new SorterService<User>();

// Sort ascending
const sortedUsers = sorter.sortBy(users, 'name');

// Sort descending  
const sortedUsersDesc = sorter.sortByDesc(users, 'name');
```

## Components

### BaseListComponent

Abstract component for list views with pagination, selection, and CRUD operations.

```typescript
import { BaseListComponent } from 'ddata-core';

@Component({
  selector: 'user-list',
  template: `
    <!-- Your list template -->
  `
})
export class UserListComponent extends BaseListComponent<User> {
  type = User;

  // Inherited properties:
  // models: Array<User>
  // paginate: PaginateInterface
  // filter: Record<string, unknown>
  // isModal: boolean
  // isEmbed: boolean
  // loadData: boolean

  // Inherited events:
  // @Output() editModel: EventEmitter<User>
  // @Output() deleteModel: EventEmitter<User>
  // @Output() deleteMultipleModels: EventEmitter<Array<User>>
  // @Output() saveModel: EventEmitter<User>

  ngOnInit() {
    super.ngOnInit();
    // Additional initialization
  }
}
```

### BaseCreateEditComponent

Abstract component for create/edit forms.

```typescript
import { BaseCreateEditComponent } from 'ddata-core';

@Component({
  selector: 'user-form',
  template: `
    <!-- Your form template -->
  `
})
export class UserFormComponent extends BaseCreateEditComponent<User> {
  type = User;

  // Inherited properties:
  // model: User
  // isModal: boolean
  // isEmbed: boolean

  ngOnInit() {
    super.ngOnInit();
    // Additional initialization
  }
}
```

### SelectableListComponent

Enhanced list component with multi-selection capabilities.

```typescript
import { SelectableListComponent, SelectableInterface } from 'ddata-core';

interface SelectableUser extends User, SelectableInterface {
  selected: boolean;
}

@Component({
  selector: 'selectable-user-list',
  template: `
    <!-- Your selectable list template -->
  `
})
export class SelectableUserListComponent extends SelectableListComponent<SelectableUser> {
  type = User;

  // Additional selection methods available:
  // selectAll()
  // deselectAll()
  // getSelectedModels(): Array<SelectableUser>
  // hasSelectedModels(): boolean
}
```

## Error Handling

### Error Classes

```typescript
import { 
  DdataCoreError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  MethodNotAllowedError,
  UnprocessableEntityError,
  InternalServerError,
  ValidationError
} from 'ddata-core';

// Custom error handling
try {
  // Some operation
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Validation errors:', error.invalids);
  } else if (error instanceof NotFoundError) {
    console.log('Resource not found');
  }
  // Handle other error types
}
```

### Validation Error

```typescript
import { ValidationError, ValidationErrorSettingsInterface } from 'ddata-core';

const settings: ValidationErrorSettingsInterface = {
  message: 'Validation failed',
  invalids: ['email', 'name']
};

throw new ValidationError(settings);
```

## Types

### Base Data Types

```typescript
import { ID, ISODate, NotificationType } from 'ddata-core';

// ID: number type for unique identifiers
const userId: ID = 42;

// ISODate: string in YYYY-MM-DD format
const date: ISODate = '2023-12-25';

// NotificationType: 'success' | 'info' | 'warning' | 'danger'
const type: NotificationType = 'success';
```

## Common Usage Patterns

### Complete CRUD Example

```typescript
import { Component, OnInit } from '@angular/core';
import { 
  BaseModel, 
  ProxyService, 
  HelperService,
  PaginateInterface 
} from 'ddata-core';

// 1. Define Model
export class User extends BaseModel {
  id = 0;
  name = '';
  email = '';
  api_endpoint = '/api/users';
  model_name = 'User';
  
  validationRules = {
    name: ['required', 'string'],
    email: ['required', 'email']
  };

  init(data: any = null): User {
    if (data) {
      this.id = data.id || 0;
      this.name = data.name || '';
      this.email = data.email || '';
    }
    return this;
  }

  prepareToSave(): any {
    return {
      id: this.id,
      name: this.name,
      email: this.email
    };
  }
}

// 2. Use in Component
@Component({
  selector: 'app-users',
  template: `
    <div *ngFor="let user of users">
      {{ user.name }} - {{ user.email }}
      <button (click)="editUser(user)">Edit</button>
      <button (click)="deleteUser(user)">Delete</button>
    </div>
  `
})
export class UsersComponent implements OnInit {
  users: Array<User> = [];
  paginate: PaginateInterface;
  
  private proxy: ProxyService<User>;
  private helper: HelperService<User>;

  constructor() {
    const userModel = new User();
    this.proxy = new ProxyService(userModel);
    this.helper = new HelperService(userModel);
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.proxy.getAll().subscribe(paginate => {
      this.paginate = paginate;
      this.users = paginate.data;
    });
  }

  saveUser(user: User) {
    this.helper.save(user).subscribe(success => {
      if (success) {
        this.loadUsers();
      }
    });
  }

  deleteUser(user: User) {
    this.helper.delete(user, this).subscribe(success => {
      if (success) {
        this.loadUsers();
      }
    });
  }
}
```

### Search with Filters

```typescript
searchUsers(filters: any) {
  this.proxy.search(filters, 1).subscribe(results => {
    this.users = results.data;
    this.paginate = results;
  });
}

// Or without pagination
searchUsersSimple(filters: any) {
  this.proxy.searchWithoutPaginate(filters).subscribe(users => {
    this.users = users;
  });
}
```

### File Upload

```typescript
uploadFiles(files: FileList, userId: number) {
  const fileSet = new Set(Array.from(files));
  const additionalData = { userId: userId, folder: 'avatars' };
  
  const uploads = this.proxy.sendFiles('/upload', userId, fileSet, additionalData);
  
  uploads.forEach(upload$ => {
    upload$.subscribe(progress => {
      if (progress.remoteFileDatas) {
        console.log('Upload complete:', progress.remoteFileDatas);
      } else {
        progress.progress.subscribe(percent => {
          console.log(`Upload progress: ${percent}%`);
        });
      }
    });
  });
}
```

### Local Storage Integration

```typescript
// Model with localStorage enabled
export class CachedUser extends BaseModel {
  use_localstorage = true; // Enable localStorage sync
  api_endpoint = '/api/users';
  model_name = 'CachedUser';
  
  // ... rest of implementation
}

// Service will automatically sync between localStorage and API
const cachedProxy = new ProxyService(new CachedUser());
```

## Best Practices

1. **Model Definition**: Always define `api_endpoint`, `model_name`, and `use_localstorage`
2. **Validation**: Define `validationRules` for data integrity
3. **Initialization**: Implement `init()` and `prepareToSave()` methods
4. **Error Handling**: Use try-catch blocks with validation
5. **Memory Management**: Unsubscribe from observables in component `ngOnDestroy`
6. **Type Safety**: Use generic types consistently (`ProxyService<User>`)
7. **Loading States**: Use `SpinnerService` for user feedback
8. **Notifications**: Provide user feedback with `NotificationService`

This documentation provides comprehensive coverage of the ddata-core library's API, enabling AI agents to effectively work with the codebase and implement data management features in Angular applications.
