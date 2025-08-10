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

## Core Architecture

The library follows a layered architecture:
1. **Models**: Data structures and validation
2. **Services**: Data access layer (local/remote/proxy)
3. **Components**: Abstract base components
4. **Error Handling**: Comprehensive error management

## Models

### BaseModel

Abstract base class for all data models with validation, serialization, and field management.

```typescript
import { BaseModel, ID, ISODate } from 'ddata-core';

export class User extends BaseModel {
  id: ID;
  name: string;
  email: string;
  api_endpoint = '/api/users';
  model_name = 'User';
  use_localstorage = false;

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
```

#### BaseModel Methods

**Core Methods:**
- `init(data?: any): T` - Initialize model from data
- `prepareToSave(): any` - Prepare data for persistence
- `validate(): void` - Validate model against rules
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

### Storage Service

Local storage management with reactive updates.

```typescript
import { StorageService } from 'ddata-core';

@Injectable()
export class MyService {
  constructor(private storage: StorageService) {}

  // Watch storage changes
  watchChanges() {
    this.storage.watchStorage().subscribe(changed => {
      console.log('Storage changed');
    });
  }

  // Set item
  saveData() {
    this.storage.setItem('key', JSON.stringify(data));
  }

  // Remove item
  removeData() {
    this.storage.removeItem('key');
  }

  // Clear all
  clearAll() {
    this.storage.clear();
  }
}
```

### Local Data Service

For localStorage-based data management.

```typescript
import { LocalDataService } from 'ddata-core';

const localService = new LocalDataService<User>(new User());

// Get all items
const users: Array<User> = localService.allFromLocal();

// Get sorted items
const sortedUsers: Array<User> = localService.allFromLocalSortedBy('name');
const sortedUsersDesc: Array<User> = localService.allFromLocalSortedByDesc('name');

// Find by ID
const user: User = localService.findById(42);

// Find by field
const user: User = localService.findByField('email', 'user@example.com');

// Filter by field
const users: Array<User> = localService.filterByField('active', true);

// Save (creates or updates)
localService.save(user, user.id || Date.now());

// Delete
localService.delete(user);

// Watch changes
localService.watch().subscribe(() => {
  console.log('Local data changed');
});
```

### Remote Data Service

For API-based data management.

```typescript
import { RemoteDataService } from 'ddata-core';

const remoteService = new RemoteDataService<User>(new User());

// Get paginated data
remoteService.getAll(1).subscribe((paginate: PaginateInterface) => {
  console.log(paginate.data); // Array of User models
});

// Get specific page
remoteService.getPage(2).subscribe((paginate: PaginateInterface) => {
  // Page 2 data
});

// Get all without pagination
remoteService.getAllWithoutPaginate().subscribe((users: Array<User>) => {
  // All users
});

// Get one by ID
remoteService.getOne(42).subscribe((user: User) => {
  // User with ID 42
});

// Custom URI
remoteService.getUri('/users/active').subscribe((data: any) => {
  // Custom endpoint data
});

// POST to custom URI
remoteService.postUri(searchData, '/search').subscribe((results: any) => {
  // Search results
});

// Save (create or update)
remoteService.save(user).subscribe((id: number) => {
  user.id = id;
});

// Delete
remoteService.delete(user).subscribe((result: number) => {
  // HTTP status code
});

// Delete multiple
remoteService.deleteMultiple([user1, user2]).subscribe(() => {
  // Multiple delete complete
});

// File upload
const files: Set<File> = new Set([file1, file2]);
const uploadObservables = remoteService.sendFiles('/upload', userId, files, additionalData);
uploadObservables.forEach(upload$ => {
  upload$.subscribe((progress: FileUploadProcessInterface) => {
    // Handle upload progress
  });
});
```

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