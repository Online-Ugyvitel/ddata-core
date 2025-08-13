# DData UI Input - AI Agent Instructions

## Overview

`ddata-ui-input` is an Angular library providing comprehensive input components for form handling with validation, styling, and data binding capabilities. This library is designed to work with the `ddata-core` ecosystem and provides standardized input controls with consistent API patterns.

## Dependencies

- **@angular/common** (>=13.2.3) - Angular common module
- **@angular/core** (>=13.2.3) - Angular core framework
- **@fortawesome/angular-fontawesome** (>=0.7.0) - FontAwesome icons
- **@fortawesome/fontawesome-svg-core** (>=1.2.30) - FontAwesome core
- **@fortawesome/free-solid-svg-icons** (>=5.14.0) - FontAwesome solid icons
- **ddata-core** (^0.3.8) - Core data handling and validation
- **ddata-ui-common** (^0.1.17) - Common UI utilities
- **moment** (^2.27.0) - Date/time manipulation
- **ngx-color-picker** (^10.0.1) - Color picker component
- **ngx-material-timepicker** (^5.5.3) - Time picker component
- **@ng-bootstrap/ng-bootstrap** (>=12.0.0) - Bootstrap components
- **@angular/localize** (>=12.2.11) - Angular localization
- **pluralize** (^8.0.0) - String pluralization

## Module Import

```typescript
import { DdataUiInputModule } from 'ddata-ui-input';

@NgModule({
  imports: [
    DdataUiInputModule
  ]
})
export class AppModule { }
```

## Common Patterns

All input components follow consistent patterns:

### Model Binding
- Components bind to `BaseModelInterface & FieldsInterface` models
- Field metadata (label, placeholder, validation) is extracted from model.fields
- Validation rules are defined in model.validationRules

### Standard Input Properties
- `model` - Data model with field definitions
- `field` - Field name in the model
- `disabled` - Boolean to disable input
- `showLabel` - Boolean to show/hide label
- `labelClass` - CSS class for label styling
- `inputClass` - CSS class for input styling
- `wrapperClass` - CSS class for wrapper div

### Standard Output Events
- `changed` - Emitted when value changes and validation passes

## Components

### 1. DdataInputComponent

**Selector:** `dd-input`
**Purpose:** General text input with validation and character/word counting

#### Inputs
- `model: BaseModelInterface & FieldsInterface` - Data model (required)
- `field: string` - Field name (default: 'isValid')
- `disabled: boolean` - Disable input (default: false)
- `isViewOnly: boolean` - Read-only mode (default: false)
- `type: string` - HTML input type (default: 'text')
- `inputClass: string` - Input CSS class (default: 'form-control')
- `labelClass: string` - Label CSS class (default: 'col-12 col-md-3 px-0 col-form-label')
- `inputBlockClass: string` - Input block CSS class (default: 'col-12 d-flex px-0')
- `inputBlockExtraClass: string` - Extra input block CSS class (default: 'col-md-9')
- `viewOnlyClass: string` - View-only CSS class (default: 'form-control border-0 bg-light')
- `wrapperClass: string` - Wrapper CSS class (default: 'd-flex flex-wrap')
- `showLabel: boolean` - Show label (default: true)
- `autoFocus: boolean` - Auto focus on load (default: false)
- `enableCharacterCounter: boolean` - Enable character counting (default: false)
- `enableWordCounter: boolean` - Enable word counting (default: false)
- `maxLength: number` - Maximum character length (default: 255)
- `maxWords: number` - Maximum word count (default: 7)
- `wordCounterWarningMessage: string` - Warning message for word limit
- `append: string` - Text to append after input
- `prepend: string` - Text to prepend before input
- `labelText: string` - Override label text

#### Outputs
- `changed: EventEmitter<unknown>` - Emitted when value changes and validation passes
- `maxLengthReached: EventEmitter<boolean>` - Emitted when max length reached

#### Methods
- `validateField(): void` - Validates the field and emits changed event if valid
- `setWordCounterWarning(value: boolean): void` - Sets word counter warning state

#### Usage Example
```typescript
// Component
export class MyComponent {
  userModel = new UserModel();
  
  onNameChanged(model: UserModel) {
    console.log('Name changed:', model.name);
  }
}

// Template
<dd-input 
  [model]="userModel" 
  field="name"
  [enableCharacterCounter]="true"
  [maxLength]="50"
  (changed)="onNameChanged($event)">
</dd-input>
```

### 2. DdataInputCheckboxComponent

**Selector:** `dd-input-checkbox`
**Purpose:** Checkbox input with customizable icons

#### Inputs
- `model: BaseModelInterface & FieldsInterface` - Data model (required)
- `field: string` - Field name (default: 'isValid')
- `disabled: boolean` - Disable checkbox (default: false)
- `showLabel: boolean` - Show label (default: true)
- `showLabelAfter: boolean` - Show label after checkbox (default: true)
- `labelClass: string` - Label CSS class (default: 'col pl-2 col-form-label')
- `wrapperClass: string` - Wrapper CSS class (default: 'd-flex')
- `iconOn: IconDefinition` - Icon when checked (default: faCheckSquare)
- `iconOff: IconDefinition` - Icon when unchecked (default: faSquare)

#### Outputs
- `changed: EventEmitter<boolean>` - Emitted when checkbox state changes

#### Methods
- `clicked(): void` - Handles checkbox click and toggles value
- `getIcon(): IconDefinition` - Returns appropriate icon based on current state

#### Usage Example
```typescript
// Template
<dd-input-checkbox 
  [model]="settingsModel" 
  field="isEnabled"
  [showLabelAfter]="true"
  (changed)="onToggleChanged($event)">
</dd-input-checkbox>
```

### 3. DdataInputColorComponent

**Selector:** `dd-input-color`
**Purpose:** Color picker input using ngx-color-picker

#### Inputs
- `model: BaseModelInterface & FieldsInterface` - Data model (required)
- `field: string` - Field name (default: 'isValid')
- `disabled: boolean` - Disable input (default: false)
- `type: string` - Input type (default: 'text')
- `inputClass: string` - Input CSS class (default: 'form-control')
- `labelClass: string` - Label CSS class (default: 'col-12 col-md-3 px-0 col-form-label')
- `inputBlockClass: string` - Input block CSS class (default: 'col-12 d-flex px-0')
- `inputBlockExtraClass: string` - Extra input block CSS class (default: 'col-md-9')
- `showLabel: boolean` - Show label (default: true)
- `autoFocus: boolean` - Auto focus on load (default: false)
- `wrapperClass: string` - Wrapper CSS class (default: 'd-flex flex-wrap')
- `append: string` - Text to append after input
- `prepend: string` - Text to prepend before input
- `labelText: string` - Override label text

#### Outputs
- `changed: EventEmitter<BaseModelInterface & FieldsInterface>` - Emitted when color changes

#### Methods
- `validateField(): void` - Validates the field and emits changed event if valid

#### Usage Example
```typescript
// Template
<dd-input-color 
  [model]="themeModel" 
  field="primaryColor"
  (changed)="onColorChanged($event)">
</dd-input-color>
```

### 4. DdataInputDateComponent

**Selector:** `dd-input-date`
**Purpose:** Date picker using ng-bootstrap datepicker

#### Inputs
- `model: BaseModelInterface & FieldsInterface` - Data model (required)
- `field: string` - Field name (default: 'isValid')
- `disabled: boolean` - Disable input (default: false)
- `inputClass: string` - Input CSS class (default: 'form-control')
- `labelClass: string` - Label CSS class (default: 'col-12 col-md-3 px-0 col-form-label')
- `inputBlockClass: string` - Input block CSS class (default: 'col-12 d-flex px-0')
- `inputBlockExtraClass: string` - Extra input block CSS class (default: 'col-md-9')
- `showLabel: boolean` - Show label (default: true)
- `autoFocus: boolean` - Auto focus on load (default: false)
- `isViewOnly: boolean` - Read-only mode (default: false)
- `viewOnlyClass: string` - View-only CSS class (default: 'form-control border-0 bg-light')
- `buttonClass: string` - Button CSS class (default: 'input-group-prepend btn btn-light mb-0')
- `wrapperClass: string` - Wrapper CSS class (default: 'd-flex flex-wrap')
- `format: string` - Date format (default: 'YYYY-MM-DD')
- `separator: string` - Date separator (default: '-')
- `labelApply: string` - Apply button label (default: 'OK')
- `labelCancel: string` - Cancel button label (default: 'Cancel')
- `position: 'left' | 'center' | 'right'` - Popup position (default: 'center')
- `direction: 'up' | 'down'` - Popup direction (default: 'down')
- `showIcon: boolean` - Show calendar icon (default: true)
- `autoApply: boolean` - Auto apply selection (default: true)
- `singleDatePicker: boolean` - Single date mode (default: true)
- `moment: unknown` - Moment.js instance (default: moment)
- `append: string` - Text to append after input
- `prepend: string` - Text to prepend before input
- `labelText: string` - Override label text

#### Outputs
- `changed: EventEmitter<BaseModelInterface & FieldsInterface>` - Emitted when date changes

#### Methods
- `change(value: NgbDate): void` - Handles date selection from calendar
- `typeChange(event: Event): void` - Handles manual date input

#### Usage Example
```typescript
// Template
<dd-input-date 
  [model]="eventModel" 
  field="startDate"
  format="DD/MM/YYYY"
  [showIcon]="true"
  (changed)="onDateChanged($event)">
</dd-input-date>
```

### 5. DdataInputTimeComponent

**Selector:** `dd-input-time`
**Purpose:** Time picker using ngx-material-timepicker

#### Inputs
- `model: BaseModelInterface & FieldsInterface` - Data model (required)
- `field: string` - Field name (default: 'isValid')
- `disabled: boolean` - Disable input (default: false)
- `isViewOnly: boolean` - Read-only mode (default: false)
- `type: string` - Input type (default: 'text')
- `inputClass: string` - Input CSS class (default: 'form-control')
- `labelClass: string` - Label CSS class (default: 'col-12 col-md-3 px-0 col-form-label')
- `inputBlockClass: string` - Input block CSS class (default: 'col-12 d-flex px-0')
- `inputBlockExtraClass: string` - Extra input block CSS class (default: 'col-md-9')
- `viewOnlyClass: string` - View-only CSS class (default: 'form-control border-0 bg-light')
- `showLabel: boolean` - Show label (default: true)
- `autoFocus: boolean` - Auto focus on load (default: false)
- `wrapperClass: string` - Wrapper CSS class (default: 'd-flex flex-wrap')
- `format: 12 | 24` - Time format (default: 24)
- `append: string` - Text to append after input
- `prepend: string` - Text to prepend before input
- `labelText: string` - Override label text

#### Outputs
- `changed: EventEmitter<unknown>` - Emitted when time changes

#### Methods
- `validateField(): void` - Validates the field and emits changed event if valid
- `setTime(time: string): void` - Sets time value and validates

#### Usage Example
```typescript
// Template
<dd-input-time 
  [model]="appointmentModel" 
  field="startTime"
  [format]="12"
  (changed)="onTimeChanged($event)">
</dd-input-time>
```

### 6. DdataTextareaComponent

**Selector:** `dd-textarea`
**Purpose:** Textarea input with character/word counting and validation

#### Inputs
- `model: BaseModelInterface & FieldsInterface` - Data model (required)
- `field: string` - Field name (default: 'isValid')
- `inputClass: string` - Input CSS class (default: 'form-control')
- `disabled: boolean` - Disable textarea (default: false)
- `isViewOnly: boolean` - Read-only mode (default: false)
- `labelClass: string` - Label CSS class (default: 'col-12 col-md-3 px-0 col-form-label')
- `inputBlockClass: string` - Input block CSS class (default: 'col-12 d-flex px-0')
- `inputBlockExtraClass: string` - Extra input block CSS class (default: 'col-md-9')
- `viewOnlyClass: string` - View-only CSS class (default: 'form-control border-0 bg-light')
- `showLabel: boolean` - Show label (default: true)
- `autoFocus: boolean` - Auto focus on load (default: false)
- `wrapperClass: string` - Wrapper CSS class (default: 'd-flex flex-wrap')
- `rows: string` - Number of rows (default: '5')
- `enableCharacterCounter: boolean` - Enable character counting (default: false)
- `enableWordCounter: boolean` - Enable word counting (default: false)
- `maxLength: number` - Maximum character length (default: 255)
- `maxWords: number` - Maximum word count (default: 7)
- `wordCounterWarningMessage: string` - Warning message for word limit
- `append: string` - Text to append after input
- `prepend: string` - Text to prepend before input
- `labelText: string` - Override label text

#### Outputs
- `changed: EventEmitter<unknown>` - Emitted when value changes and validation passes

#### Methods
- `validateField(): void` - Validates the field and emits changed event if valid
- `setWordCounterWarning(value: boolean): void` - Sets word counter warning state

#### Usage Example
```typescript
// Template
<dd-textarea 
  [model]="articleModel" 
  field="content"
  [rows]="10"
  [enableCharacterCounter]="true"
  [maxLength]="1000"
  (changed)="onContentChanged($event)">
</dd-textarea>
```

### 7. DdataSelectComponent

**Selector:** `dd-select`
**Purpose:** Multi-mode select component (simple, single, multiple, autocomplete)

#### Inputs
- `model: BaseModelInterface & FieldsInterface` - Data model (required)
- `field: string` - Field name (default: 'id')
- `items: Array<unknown>` - Available options
- `mode: SelectType` - Selection mode: 'simple' | 'single' | 'multiple' | 'autocomplete' (default: 'simple')
- `wrapperClass: string` - Wrapper CSS class (default: 'd-flex flex-wrap')
- `labelClass: string` - Label CSS class (default: 'col-12 col-md-3 px-0 col-form-label')
- `inputBlockClass: string` - Input block CSS class (default: 'col-12 d-flex px-0')
- `inputBlockExtraClass: string` - Extra input block CSS class (default: 'col-md-9')
- `showLabel: boolean` - Show label (default: true)
- `disabledAppearance: boolean` - Disabled appearance (default: false)
- `disabled: boolean` - Disable select (default: false)
- `addEmptyOption: boolean` - Add empty option (default: true)
- `dialogSettings: DialogContentWithOptionsInterface` - Dialog configuration for complex selections
- `text: string` - Text field name in items (default: 'name')
- `valueField: string` - Value field name in items (default: 'id')
- `unselectedText: string` - Placeholder text (default: 'Válassz')
- `disableShowSelectedItems: boolean` - Hide selected items display (default: false)
- `showIcon: boolean` - Show icons in options (default: false)
- `selectedElementsBlockClass: string` - Selected elements CSS class (default: 'col-12 d-flex flex-wrap px-0')
- `selectedElementsBlockExtraClass: string` - Extra selected elements CSS class (default: 'col-md-9 d-flex flex-wrap')

#### Deprecated Inputs (use `mode` instead)
- `fakeSingleSelect: boolean` - Use mode='single'
- `multipleSelect: boolean` - Use mode='multiple'

#### Outputs
- `selected: EventEmitter<unknown>` - Emitted when item is selected
- `selectModel: EventEmitter<unknown>` - Emitted when model is selected

#### Methods
- `selectedEmit(value: unknown): void` - Emits selected event
- `selectModelEmit(value: unknown): void` - Emits selectModel event

#### Usage Example
```typescript
// Component
export class MyComponent {
  userModel = new UserModel();
  countries = [
    { id: 1, name: 'Hungary' },
    { id: 2, name: 'Germany' },
    { id: 3, name: 'France' }
  ];
  
  onCountrySelected(country: any) {
    console.log('Selected country:', country);
  }
}

// Template
<dd-select 
  [model]="userModel" 
  field="countryId"
  [items]="countries"
  mode="simple"
  text="name"
  valueField="id"
  (selected)="onCountrySelected($event)">
</dd-select>
```

### 8. DdataInputSearchComponent

**Selector:** `dd-search`
**Purpose:** Search input with real-time results and pagination

#### Inputs
- `model: SearchInterface` - Search model (default: new BaseSearch().init())
- `pageNumber: number` - Current page number (default: 0)
- `service: ProxyServiceInterface<SearchInterface>` - Search service

#### Properties
- `icon: IconSetInterface` - Search icon set
- `isActive: BehaviorSubject<boolean>` - Search active state
- `models: Array<SearchResultInterface>` - Search results
- `paginate: PaginateInterface` - Pagination data

#### Methods
- `close(): void` - Closes search results and resets state
- `search(): Observable<Array<SearchResultInterface>>` - Performs search with debouncing
- `changePage(turnToPage: number): void` - Changes to specified page
- `go(model: SearchInterface): void` - Navigates to selected result

#### Usage Example
```typescript
// Component
export class MyComponent {
  searchModel = new BaseSearch().init();
  searchService = new ProxyFactoryService<SearchInterface>().get(BaseSearch);
}

// Template
<dd-search 
  [model]="searchModel"
  [service]="searchService"
  [pageNumber]="0">
</dd-search>
```

## Services

### InputHelperService

**Purpose:** Provides utility methods for input field validation and metadata extraction

#### Methods

##### `validateField(model: BaseModelInterface & FieldsInterface, field: string): boolean`
- **Purpose:** Validates a specific field in a model
- **Parameters:**
  - `model` - The model containing the field
  - `field` - Field name to validate
- **Returns:** `boolean` - true if field is valid
- **Example:**
```typescript
const isValid = inputHelper.validateField(userModel, 'email');
```

##### `getTitle(model: BaseModelInterface & FieldsInterface, field: string): string`
- **Purpose:** Extracts title from field definition
- **Parameters:**
  - `model` - The model containing the field
  - `field` - Field name
- **Returns:** `string` - Field title
- **Example:**
```typescript
const title = inputHelper.getTitle(userModel, 'firstName'); // Returns "First Name"
```

##### `getLabel(model: BaseModelInterface & FieldsInterface, field: string): string`
- **Purpose:** Extracts label from field definition
- **Parameters:**
  - `model` - The model containing the field
  - `field` - Field name
- **Returns:** `string` - Field label
- **Example:**
```typescript
const label = inputHelper.getLabel(userModel, 'email'); // Returns "Email Address"
```

##### `getPlaceholder(model: BaseModelInterface & FieldsInterface, field: string): string`
- **Purpose:** Extracts placeholder from field definition
- **Parameters:**
  - `model` - The model containing the field
  - `field` - Field name
- **Returns:** `string` - Field placeholder
- **Example:**
```typescript
const placeholder = inputHelper.getPlaceholder(userModel, 'email'); // Returns "Enter your email"
```

##### `getPrepend(model: BaseModelInterface & FieldsInterface, field: string): string`
- **Purpose:** Gets prepend text for field
- **Parameters:**
  - `model` - The model containing the field
  - `field` - Field name
- **Returns:** `string` - Prepend text (empty if not defined)

##### `getAppend(model: BaseModelInterface & FieldsInterface, field: string): string`
- **Purpose:** Gets append text for field
- **Parameters:**
  - `model` - The model containing the field
  - `field` - Field name
- **Returns:** `string` - Append text (empty if not defined)

##### `isRequired(model: BaseModelInterface & FieldsInterface, field: string): boolean`
- **Purpose:** Checks if field is required
- **Parameters:**
  - `model` - The model containing the field
  - `field` - Field name
- **Returns:** `boolean` - true if field has 'required' validation rule

##### `randChars(): string`
- **Purpose:** Generates random character string for unique IDs
- **Returns:** `string` - 50-character random string
- **Example:**
```typescript
const uniqueId = inputHelper.randChars(); // Returns "aBc123XyZ..."
```

## Pipes

### DescriptionPipe

**Selector:** `description`
**Purpose:** Transforms description strings with special formatting for tel, email, url, and description patterns

#### Transform Method
- **Input:** `string | null | undefined`
- **Output:** Formatted HTML string
- **Patterns:**
  - `tel:123456789` → `<a href="tel:123456789" class="mr-3">123456789</a>`
  - `email:user@example.com` → `<a href="mailto:user@example.com" class="mr-3">user@example.com</a>`
  - `url:https://example.com` → `<a href="https://example.com" class="mr-3" target="_blank">https://example.com</a>`
  - `description:Some text` → `<span class="description">Some text</span>`

#### Usage Example
```typescript
// Template
<div [innerHTML]="contactInfo | description"></div>

// Data
contactInfo = "tel:+36301234567|email:contact@example.com|url:https://example.com";
```

## Interfaces and Types

### SelectType
```typescript
type SelectType = 'simple' | 'single' | 'multiple' | 'autocomplete';
```

### SearchInterface
```typescript
interface SearchInterface extends SearchUIFieldsInterface, BaseModelInterface<SearchInterface> {
  id: ID;
  icon: IconDefinition;
  searchText: string;
  name: string;
  description: string;
  type: string;
  found_model_name: string;
  url: string;
}
```

### DialogContentWithOptionsInterface
```typescript
interface DialogContentWithOptionsInterface {
  createEditComponent?: Type<unknown>;
  createEditOptions?: OptionsInterface;
  listComponent?: Type<unknown>;
  listOptions?: OptionsInterface;
}
```

### IconSetInterface
```typescript
interface IconSetInterface {
  [key: string]: IconDefinition;
}
```

### InputHelperServiceInterface
```typescript
interface InputHelperServiceInterface {
  validateField(model: BaseModelInterface<unknown> & FieldsInterface<unknown>, field: string): boolean;
  getTitle(model: BaseModelInterface<unknown> & FieldsInterface<unknown>, field: string): string;
  getLabel(model: BaseModelInterface<unknown> & FieldsInterface<unknown>, field: string): string;
  getPlaceholder(model: BaseModelInterface<unknown> & FieldsInterface<unknown>, field: string): string;
  getPrepend(model: BaseModelInterface<unknown> & FieldsInterface<unknown>, field: string): string;
  getAppend(model: BaseModelInterface<unknown> & FieldsInterface<unknown>, field: string): string;
  isRequired(model: BaseModelInterface<unknown> & FieldsInterface<unknown>, field: string): boolean;
  randChars(): string;
}
```

## Configuration and Best Practices

### Model Structure
All input components expect models that implement both `BaseModelInterface` and `FieldsInterface`:

```typescript
export class UserModel extends BaseModel implements FieldsInterface<UserModel> {
  name = '';
  email = '';
  
  fields = {
    name: {
      label: 'Full Name',
      title: 'User Full Name',
      placeholder: 'Enter your full name',
      prepend: '',
      append: ''
    },
    email: {
      label: 'Email Address',
      title: 'User Email',
      placeholder: 'Enter your email address',
      prepend: '@',
      append: '.com'
    }
  };
  
  validationRules = {
    name: ['required', 'min:2', 'max:50'],
    email: ['required', 'email']
  };
}
```

### Styling Guidelines
- Use Bootstrap classes for consistent styling
- Components provide default classes that can be overridden
- Responsive design is built-in with col-12 col-md-* classes
- Custom CSS classes can be applied via input properties

### Validation Flow
1. User interacts with input
2. Component calls `InputHelperService.validateField()`
3. Validation service checks value against validation rules
4. If valid, `changed` event is emitted
5. If invalid, validation error is added to model.validationErrors

### Common Usage Patterns

#### Simple Form
```typescript
// Component
export class UserFormComponent {
  userModel = new UserModel();
  
  onFieldChanged(model: UserModel) {
    console.log('Field changed, model is valid:', model.validationErrors.length === 0);
  }
}

// Template
<form>
  <dd-input [model]="userModel" field="name" (changed)="onFieldChanged($event)"></dd-input>
  <dd-input [model]="userModel" field="email" type="email" (changed)="onFieldChanged($event)"></dd-input>
  <dd-textarea [model]="userModel" field="bio" [rows]="5" (changed)="onFieldChanged($event)"></dd-textarea>
</form>
```

#### Select with API Data
```typescript
// Component
export class UserFormComponent {
  userModel = new UserModel();
  countries: Country[] = [];
  
  ngOnInit() {
    this.loadCountries();
  }
  
  loadCountries() {
    this.countryService.getAll().subscribe(countries => {
      this.countries = countries;
    });
  }
  
  onCountrySelected(countryId: number) {
    console.log('Selected country ID:', countryId);
  }
}

// Template
<dd-select 
  [model]="userModel" 
  field="countryId"
  [items]="countries"
  mode="simple"
  text="name"
  valueField="id"
  (selected)="onCountrySelected($event)">
</dd-select>
```

#### Date Range Selection
```typescript
// Component
export class EventFormComponent {
  eventModel = new EventModel();
  
  onStartDateChanged(model: EventModel) {
    console.log('Start date changed:', model.startDate);
  }
  
  onEndDateChanged(model: EventModel) {
    console.log('End date changed:', model.endDate);
  }
}

// Template
<dd-input-date 
  [model]="eventModel" 
  field="startDate"
  (changed)="onStartDateChanged($event)">
</dd-input-date>
<dd-input-date 
  [model]="eventModel" 
  field="endDate"
  (changed)="onEndDateChanged($event)">
</dd-input-date>
```

## Error Handling

### Common Errors and Solutions

1. **"The input-box component get undefined model"**
   - Solution: Ensure model is initialized before passing to component
   - Check that model is not null or undefined

2. **"Your Model's 'fields' field is [undefined/null]"**
   - Solution: Initialize fields property in your model class
   - Ensure fields object contains definition for the specified field

3. **"Missing validation rule"**
   - Solution: Add validation rules for the field in model.validationRules
   - Include appropriate validation rules like 'required', 'email', etc.

4. **"The model not contains the 'field' field's title/label/placeholder"**
   - Solution: Add missing field metadata in model.fields[fieldName]
   - Provide title, label, and placeholder properties

### Debugging Tips
- Enable console logging to see validation errors
- Check that ddata-core is properly imported and configured
- Verify that all required dependencies are installed
- Use browser developer tools to inspect component state
- Test validation rules independently using ValidatorService

## Advanced Features

### Custom Validation
```typescript
// Custom validation service
@Injectable()
export class CustomValidatorService extends ValidatorService {
  validateCustomRule(value: any, rule: string): boolean {
    // Custom validation logic
    return true;
  }
}

// In module
@NgModule({
  providers: [
    { provide: ValidatorService, useClass: CustomValidatorService }
  ]
})
export class AppModule { }
```

### Dynamic Form Generation
```typescript
// Dynamic form component
export class DynamicFormComponent {
  formFields = [
    { type: 'input', field: 'name', label: 'Name' },
    { type: 'email', field: 'email', label: 'Email' },
    { type: 'textarea', field: 'message', label: 'Message' }
  ];
  
  model = new ContactModel();
  
  getComponentType(fieldType: string): string {
    const componentMap = {
      'input': 'dd-input',
      'email': 'dd-input',
      'textarea': 'dd-textarea',
      'date': 'dd-input-date',
      'time': 'dd-input-time',
      'color': 'dd-input-color',
      'checkbox': 'dd-input-checkbox',
      'select': 'dd-select'
    };
    return componentMap[fieldType] || 'dd-input';
  }
}
```

This documentation provides comprehensive information for AI agents to work effectively with the ddata-ui-input library, including all component APIs, configuration options, usage patterns, and troubleshooting guidance.