# DData UI Input - AI Agent Instructions

## Overview

`ddata-ui-input` is an Angular library that provides a comprehensive suite of form input components designed to work seamlessly with the `ddata-core` ecosystem. It eliminates the need to build custom input components from scratch by providing battle-tested, feature-rich components with consistent APIs, built-in validation, and standardized UI patterns.

## Why Use DData UI Input Instead of Custom Implementation?

### 1. **Eliminates Repetitive Component Development**

Almost every Angular project needs to handle different types of input fields (text, date, time, select, textarea, checkboxes, color pickers). Without ddata-ui-input, you would need to:

**Without ddata-ui-input (Custom Implementation):**
```typescript
// You'd need to create this for EVERY input type
@Component({
  template: `
    <div class="form-group">
      <label [for]="fieldId">{{ fieldLabel }}</label>
      <input 
        [id]="fieldId"
        [type]="inputType"
        [value]="currentValue"
        [disabled]="isDisabled"
        (input)="onInputChange($event)"
        (blur)="onFieldBlur()"
        class="form-control">
      <div *ngIf="hasError" class="text-danger">{{ errorMessage }}</div>
      <div *ngIf="showCounter">{{ characterCount }}/{{ maxLength }}</div>
    </div>
  `
})
export class CustomTextInputComponent {
  @Input() model: any;
  @Input() field: string;
  @Input() inputType = 'text';
  @Input() isDisabled = false;
  @Input() maxLength = 255;
  @Input() showCounter = false;
  
  fieldId: string;
  fieldLabel: string;
  currentValue: any;
  hasError: boolean;
  errorMessage: string;
  characterCount: number;
  
  ngOnInit() {
    // Manual initialization logic
    this.fieldId = this.generateId();
    this.fieldLabel = this.extractLabel();
    this.currentValue = this.model[this.field];
    this.validateField();
  }
  
  onInputChange(event: any) {
    // Manual value handling
    this.currentValue = event.target.value;
    this.model[this.field] = this.currentValue;
    this.validateField();
    this.updateCharacterCount();
  }
  
  validateField() {
    // Manual validation logic - you'd need to implement this
    // for every field type and validation rule
  }
  
  extractLabel() {
    // Manual field metadata extraction
  }
  
  generateId() {
    // Manual ID generation
  }
  
  // Repeat this entire process for date inputs, select inputs, 
  // textareas, checkboxes, time inputs, color inputs...
}
```

**With ddata-ui-input (One Line Solution):**
```typescript
// Single line covers ALL the complexity above
<dd-input [model]="userModel" field="name"></dd-input>
<dd-input-date [model]="userModel" field="birthDate"></dd-input-date>
<dd-select [model]="userModel" field="countryId" [items]="countries"></dd-select>
<dd-textarea [model]="userModel" field="bio"></dd-textarea>
<dd-input-checkbox [model]="userModel" field="isActive"></dd-input-checkbox>
```

### 2. **Prevents Common UI/UX Inconsistencies**

**Problem:** Custom components often lead to inconsistent user experience across the application:
- Different styling patterns
- Inconsistent validation feedback
- Varying loading states
- Different error message formats
- Inconsistent accessibility features

**Solution:** ddata-ui-input provides unified UI patterns:
```typescript
// All components follow the same styling and behavior patterns
<dd-input [model]="model" field="name" [maxLength]="50" [enableCharacterCounter]="true"></dd-input>
<dd-textarea [model]="model" field="description" [maxLength]="500" [enableCharacterCounter]="true"></dd-textarea>
// Both automatically show "45/50" style counters, validation errors in same format, etc.
```

### 3. **Automatic Integration with ddata-core Validation**

**Without ddata-ui-input:** You'd need to manually integrate validation for every field:
```typescript
onInputChange() {
  // Manual validation for each component
  const validationService = new ValidatorService();
  const rules = this.model.validationRules[this.field];
  const isValid = validationService.validate(this.model[this.field], rules);
  
  if (!isValid) {
    this.hasError = true;
    this.errorMessage = this.generateErrorMessage(rules);
  } else {
    this.hasError = false;
    this.model.validationErrors = this.model.validationErrors.filter(e => e.field !== this.field);
  }
}
```

**With ddata-ui-input:** Validation is automatic and consistent:
```typescript
// Validation happens automatically based on model.validationRules
export class User extends BaseModel {
  validationRules = {
    name: ['required', 'min:2', 'max:50'],
    email: ['required', 'email'],
    age: ['required', 'integer', 'between:18,100']
  };
}

// All components automatically validate and show errors
<dd-input [model]="user" field="name"></dd-input>  <!-- Auto validates: required, min:2, max:50 -->
<dd-input [model]="user" field="email" type="email"></dd-input>  <!-- Auto validates: required, email -->
<dd-input [model]="user" field="age" type="number"></dd-input>  <!-- Auto validates: required, integer, between:18,100 -->
```

## How It Helps Avoid Common Errors

### 1. **Prevents Undefined/Null Reference Errors**

**Common Problem in Custom Components:**
```typescript
// This often crashes with "Cannot read property 'label' of undefined"
displayLabel = this.model.fields[this.field].label;

// This crashes with "Cannot read property 'length' of undefined"  
characterCount = this.model[this.field].length;
```

**How ddata-ui-input Solves This:**
```typescript
// InputHelperService safely extracts field metadata with fallbacks
export class InputHelperService {
  getLabel(model: BaseModelInterface & FieldsInterface, field: string): string {
    return model?.fields?.[field]?.label || field || '';  // Safe fallback chain
  }
  
  getPlaceholder(model: BaseModelInterface & FieldsInterface, field: string): string {
    return model?.fields?.[field]?.placeholder || '';  // Never undefined
  }
}

// Components use safe value access
get fieldValue(): string {
  return this.model?.[this.field] || '';  // Always returns string, never undefined
}
```

### 2. **Eliminates Type Conversion Errors**

**Common Problem:**
```typescript
// User enters "abc" in a number field
this.model.age = event.target.value;  // age becomes string "abc"
const doubled = this.model.age * 2;   // NaN result breaks calculations
```

**ddata-ui-input Solution:**
```typescript
// Components automatically handle type conversion based on field type
<dd-input [model]="user" field="age" type="number"></dd-input>

// Internal handling ensures proper types
validateField(): void {
  const value = this.inputElement.nativeElement.value;
  
  // Automatic type conversion based on validation rules
  if (this.hasNumericValidation()) {
    this.model[this.field] = this.isValid(value) ? Number(value) : 0;
  } else {
    this.model[this.field] = String(value);
  }
}
```

### 3. **Prevents Validation Inconsistencies**

**Common Problem:**
```typescript
// Different validation logic in different components
// Email validation in one component:
isEmailValid(email: string): boolean {
  return email.includes('@');  // Too simple
}

// Email validation in another component:
isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);  // Different pattern
}
```

**ddata-ui-input Solution:**
```typescript
// Centralized validation through ddata-core ValidatorService
// All components use the same validation rules consistently
export class User extends BaseModel {
  validationRules = {
    email: ['required', 'email']  // Uses ddata-core's standardized email validation
  };
}

// Result: All email fields validate exactly the same way across the entire application
```

## How It Helps Avoid Reinventing the Same Thing Again

### 1. **Common UI Patterns Are Pre-Built**

Instead of implementing these patterns repeatedly:

**Character/Word Counters:**
```typescript
// You don't need to implement this in every text component
<dd-input 
  [model]="model" 
  field="title" 
  [enableCharacterCounter]="true" 
  [maxLength]="50">
</dd-input>
<!-- Automatically shows: "23/50 characters" -->

<dd-textarea 
  [model]="model" 
  field="content" 
  [enableWordCounter]="true" 
  [maxWords]="100">
</dd-textarea>
<!-- Automatically shows: "87/100 words" -->
```

**Prepend/Append Text:**
```typescript
// Built-in support for input decorations
<dd-input [model]="model" field="price" prepend="$" append="USD"></dd-input>
<!-- Renders: [$_____USD] -->

<dd-input [model]="model" field="website" prepend="https://"></dd-input>
<!-- Renders: [https://_________] -->
```

**View-Only Mode:**
```typescript
// Automatic read-only rendering
<dd-input [model]="model" field="username" [isViewOnly]="true"></dd-input>
<!-- Renders as styled div instead of input when viewing data -->
```

### 2. **Complex Component Interactions Are Solved**

**Date Picker Integration:**
```typescript
// Instead of integrating ng-bootstrap datepicker manually
<dd-input-date [model]="event" field="startDate" format="DD/MM/YYYY"></dd-input-date>
<!-- Automatically includes:
- Calendar popup
- Date format validation  
- Locale support
- Keyboard navigation
- Accessibility features -->
```

**Multi-Mode Select Component:**
```typescript
// One component handles all selection scenarios
<dd-select mode="simple" [model]="user" field="countryId" [items]="countries"></dd-select>
<dd-select mode="multiple" [model]="user" field="skillIds" [items]="skills"></dd-select>
<dd-select mode="autocomplete" [model]="user" field="cityId" [items]="cities"></dd-select>
<!-- Each mode has different UI but consistent API -->
```

### 3. **Advanced Features Are Included**

**Search with Pagination:**
```typescript
// Real-time search with built-in debouncing and pagination
<dd-search 
  [model]="searchModel" 
  [service]="searchService"
  [pageNumber]="currentPage">
</dd-search>
<!-- Includes:
- Debounced search (prevents API spam)
- Pagination controls
- Loading states
- Error handling
- Result highlighting -->
```

## How It Relates to ddata-core Package

### **Architectural Integration**

ddata-ui-input is the **presentation layer** that sits on top of ddata-core's **data management layer**:

```
┌─────────────────────────────────────────┐
│           ddata-ui-input                │  ← Presentation Layer
│  ┌─────────────┐ ┌─────────────┐       │
│  │ dd-input    │ │ dd-select   │ ...   │
│  │ dd-textarea │ │ dd-checkbox │       │
│  └─────────────┘ └─────────────┘       │
└─────────────────┬───────────────────────┘
                  │ uses
┌─────────────────┴───────────────────────┐
│              ddata-core                 │  ← Data Management Layer
│  ┌─────────────┐ ┌─────────────┐       │
│  │ BaseModel   │ │ Validation  │       │
│  │ ProxyService│ │ LocalStorage│       │
│  └─────────────┘ └─────────────┘       │
└─────────────────────────────────────────┘
```

### **Model-Driven Architecture**

**ddata-core provides the model foundation:**
```typescript
// BaseModel from ddata-core
export class User extends BaseModel {
  readonly api_endpoint = '/api/users';
  readonly model_name = 'User';
  
  name: string;
  email: string;
  
  // Field definitions for UI components
  fields = {
    name: {
      label: 'Full Name',
      placeholder: 'Enter your full name',
      title: 'User Full Name'
    },
    email: {
      label: 'Email Address', 
      placeholder: 'your.email@example.com',
      title: 'User Email Address'
    }
  };
  
  // Validation rules for UI validation
  validationRules = {
    name: ['required', 'min:2', 'max:50'],
    email: ['required', 'email']
  };
}
```

**ddata-ui-input consumes this model structure:**
```typescript
// Components automatically use field definitions and validation rules
<dd-input [model]="user" field="name"></dd-input>
<!-- Automatically gets:
- Label: "Full Name" (from fields.name.label)
- Placeholder: "Enter your full name" (from fields.name.placeholder)  
- Validation: required, min:2, max:50 (from validationRules.name)
- Title attribute: "User Full Name" (from fields.name.title) -->
```

### **Service Integration**

**ddata-core's ValidatorService powers validation:**
```typescript
// ddata-ui-input components use ddata-core's validation engine
export class DdataInputComponent {
  validateField(): void {
    // Uses ValidatorService from ddata-core
    const isValid = this.helperService.validateField(this.model, this.field);
    
    if (isValid) {
      this.changed.emit(this.model);  // Only emit when valid
    }
  }
}
```

**ddata-core's ProxyService enables data operations:**
```typescript
// Form components can directly save using ddata-core services
export class UserFormComponent {
  user = new User();
  userProxy = new ProxyService<User>(new User());
  
  onUserNameChanged(model: User) {
    // Auto-save when field changes (if desired)
    this.userProxy.save(model).subscribe();
  }
}
```

### **Consistent Error Handling**

```typescript
// ddata-core's error handling integrates with UI components
export class User extends BaseModel {
  validationRules = {
    email: ['required', 'email']
  };
}

// When validation fails:
<dd-input [model]="user" field="email"></dd-input>
<!-- Component automatically shows validation errors from model.validationErrors -->
<!-- Error format standardized by ddata-core's ValidatorService -->
```

## Dependencies

**Core Dependencies:**
- **ddata-core** (^0.3.8) - **REQUIRED** - Provides BaseModel, validation, field definitions, and data management
- **@angular/common** (>=13.2.3) - Angular common module for directives and pipes
- **@angular/core** (>=13.2.3) - Angular core framework

**UI Enhancement Dependencies:**
- **@fortawesome/angular-fontawesome** (>=0.7.0) - Icon components (used in checkbox, buttons)
- **@fortawesome/fontawesome-svg-core** (>=1.2.30) - FontAwesome core library
- **@fortawesome/free-solid-svg-icons** (>=5.14.0) - Solid icon set (check, square, calendar, clock icons)
- **@ng-bootstrap/ng-bootstrap** (>=12.0.0) - Bootstrap components (date picker integration)
- **ngx-color-picker** (^10.0.1) - Advanced color picker with palettes and formats
- **ngx-material-timepicker** (^5.5.3) - Material Design time picker component

**Utility Dependencies:**
- **ddata-ui-common** (^0.1.17) - Shared UI utilities and base components
- **moment** (^2.27.0) - Date/time manipulation and formatting
- **@angular/localize** (>=12.2.11) - Internationalization support
- **pluralize** (^8.0.0) - English pluralization rules (for word counters)

**Why Each Dependency Matters:**

- **ddata-core**: Without this, components won't have validation, field metadata, or model structure
- **FontAwesome**: Provides consistent iconography across all input components
- **ng-bootstrap**: Powers the professional date picker experience
- **ngx-color-picker**: Enables advanced color selection with RGB, HSL, HEX support  
- **ngx-material-timepicker**: Provides intuitive time selection with 12/24 hour formats
- **moment**: Handles complex date operations and formatting consistently
- **pluralize**: Enables intelligent word counting (e.g., "1 word" vs "2 words")

## Module Import

```typescript
import { DdataUiInputModule } from 'ddata-ui-input';

@NgModule({
  imports: [
    DdataUiInputModule,
    // If using standalone components:
    DdataUiInputModule.forRoot()
  ]
})
export class AppModule { }
```

**Important Configuration Notes:**
- Import `DdataCoreModule.forRoot(environment)` **before** `DdataUiInputModule` 
- Ensure FontAwesome icons are properly configured in your app module
- Bootstrap CSS must be included in your styles for proper appearance

## Common Patterns and Default Behaviors

All ddata-ui-input components follow these consistent patterns to avoid reinventing common functionality:

### **Automatic Field Metadata Extraction**

Components automatically extract field information from your model's `fields` property:

```typescript
export class User extends BaseModel {
  name: string;
  
  fields = {
    name: {
      label: 'Full Name',           // Used as field label
      title: 'User Full Name',      // Used as title attribute
      placeholder: 'Enter name',    // Used as input placeholder
      prepend: '',                  // Text before input
      append: ''                    // Text after input
    }
  };
}

// Component automatically uses this metadata
<dd-input [model]="user" field="name"></dd-input>
<!-- Renders with label "Full Name", placeholder "Enter name", etc. -->
```

**Fallback Behavior When Metadata Missing:**
- **Label**: Uses field name capitalized (e.g., "firstName" → "First Name")
- **Placeholder**: Uses empty string (no placeholder shown)
- **Title**: Uses field name
- **Prepend/Append**: Uses empty string

### **Automatic Validation Integration**

All components integrate with ddata-core's validation system:

```typescript
export class User extends BaseModel {
  validationRules = {
    email: ['required', 'email', 'max:255'],
    age: ['required', 'integer', 'between:18,100']
  };
}
```

**Validation Behavior:**
1. **Input Change**: Validation runs automatically on every input change
2. **Valid State**: `changed` event is emitted with the model
3. **Invalid State**: Error is added to `model.validationErrors`, no `changed` event
4. **Error Display**: Validation errors are automatically shown below the input
5. **Error Clearing**: Errors automatically clear when field becomes valid

### **Standard Input Properties (All Components)**

These properties work consistently across all input components:

| Property | Type | Default | Purpose |
|----------|------|---------|---------|
| `model` | `BaseModelInterface & FieldsInterface` | **Required** | The data model containing the field |
| `field` | `string` | `'isValid'` | Field name in the model to bind to |
| `disabled` | `boolean` | `false` | Disables the input component |
| `showLabel` | `boolean` | `true` | Shows/hides the field label |
| `labelClass` | `string` | `'col-12 col-md-3 px-0 col-form-label'` | CSS classes for label element |
| `inputClass` | `string` | `'form-control'` | CSS classes for input element |
| `wrapperClass` | `string` | `'d-flex flex-wrap'` | CSS classes for wrapper container |
| `labelText` | `string` | `''` | Override label text (ignores model.fields) |

### **Standard Output Events (All Components)**

| Event | Type | When Emitted | Purpose |
|-------|------|--------------|---------|
| `changed` | `EventEmitter<ModelType>` | When field value changes AND passes validation | Notify parent of valid changes |

**Important:** The `changed` event only fires when validation passes. For invalid input, the event is not emitted, but the model field is still updated (allowing real-time validation feedback).

### **Responsive Design Defaults**

All components use Bootstrap responsive classes by default:

- **Labels**: `col-12 col-md-3` (full width on mobile, 1/4 width on desktop)
- **Inputs**: `col-12 col-md-9` (full width on mobile, 3/4 width on desktop)
- **Wrapper**: `d-flex flex-wrap` (flexible layout that wraps on small screens)

This provides mobile-first design without additional configuration.

## Components

### 1. DdataInputComponent - Text Input with Advanced Features

**Selector:** `dd-input`  
**Purpose:** Professional text input component with validation, character/word counting, and advanced formatting options

#### Why Use dd-input Instead of HTML Input?

**HTML Input Problems:**
```html
<!-- Basic HTML input requires manual everything -->
<div class="form-group">
  <label for="userName">User Name</label>
  <input 
    id="userName" 
    type="text"
    [(ngModel)]="user.name"
    [disabled]="isReadOnly"
    class="form-control"
    placeholder="Enter name"
    maxlength="50"
    (input)="validateName($event)"
    (blur)="saveField()">
  <div *ngIf="nameError" class="text-danger">{{ nameError }}</div>
  <div class="text-muted">{{ nameLength }}/50 characters</div>
</div>

<!-- You need to implement ALL of this manually: -->
<!-- - Label extraction from model -->
<!-- - Validation error handling -->
<!-- - Character counting -->
<!-- - Responsive design -->
<!-- - Consistent styling -->
<!-- - Auto-focus handling -->
<!-- - View-only mode -->
```

**dd-input Solution:**
```html
<!-- One line replaces all the above complexity -->
<dd-input 
  [model]="user" 
  field="name" 
  [enableCharacterCounter]="true" 
  [maxLength]="50">
</dd-input>

<!-- Automatically provides: -->
<!-- ✓ Label from user.fields.name.label -->
<!-- ✓ Placeholder from user.fields.name.placeholder -->
<!-- ✓ Validation from user.validationRules.name -->
<!-- ✓ Character counter (47/50) -->
<!-- ✓ Error display when validation fails -->
<!-- ✓ Responsive Bootstrap layout -->
<!-- ✓ Consistent styling across app -->
<!-- ✓ Two-way binding with validation -->
```

#### Complete Input Properties

| Property | Type | Default | Description | Example |
|----------|------|---------|-------------|---------|
| `model` | `BaseModelInterface & FieldsInterface` | **Required** | Model containing the field and metadata | `userModel` |
| `field` | `string` | `'isValid'` | Field name in model to bind to | `'firstName'` |
| `type` | `string` | `'text'` | HTML input type | `'email'`, `'password'`, `'number'` |
| `disabled` | `boolean` | `false` | Disables input interaction | `true` when form is submitting |
| `isViewOnly` | `boolean` | `false` | Renders as styled div instead of input | `true` for read-only displays |
| `autoFocus` | `boolean` | `false` | Focuses input when component loads | `true` for primary form field |
| `enableCharacterCounter` | `boolean` | `false` | Shows character count below input | `true` for limited length fields |
| `enableWordCounter` | `boolean` | `false` | Shows word count below input | `true` for content fields |
| `maxLength` | `number` | `255` | Maximum character limit | `50` for names, `1000` for descriptions |
| `maxWords` | `number` | `7` | Maximum word limit | `100` for summaries |
| `wordCounterWarningMessage` | `string` | `''` | Custom warning when approaching word limit | `'Consider shortening your text'` |
| `append` | `string` | `''` | Text displayed after input | `'@domain.com'`, `'%'`, `'units'` |
| `prepend` | `string` | `''` | Text displayed before input | `'$'`, `'https://'`, `'+'` |
| `labelText` | `string` | `''` | Override label (ignores model.fields.label) | `'Custom Label'` |

#### Styling Properties

| Property | Type | Default | Purpose |
|----------|------|---------|---------|
| `inputClass` | `string` | `'form-control'` | CSS classes for the input element |
| `labelClass` | `string` | `'col-12 col-md-3 px-0 col-form-label'` | CSS classes for label element |
| `inputBlockClass` | `string` | `'col-12 d-flex px-0'` | CSS classes for input container |
| `inputBlockExtraClass` | `string` | `'col-md-9'` | Additional CSS classes when label is shown |
| `viewOnlyClass` | `string` | `'form-control border-0 bg-light'` | CSS classes for view-only mode |
| `wrapperClass` | `string` | `'d-flex flex-wrap'` | CSS classes for outer wrapper |

#### Output Events

| Event | Type | Payload | When Emitted |
|-------|------|---------|--------------|
| `changed` | `EventEmitter<ModelType>` | Updated model instance | When input changes AND validation passes |
| `maxLengthReached` | `EventEmitter<boolean>` | `true` when at limit | When character count reaches maxLength |

#### Public Methods

| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| `validateField()` | none | `void` | Manually trigger field validation |
| `setWordCounterWarning(value: boolean)` | `value: boolean` | `void` | Manually set word counter warning state |

#### Advanced Usage Examples

**1. Basic Text Input with Validation**
```typescript
// Model setup
export class User extends BaseModel {
  name: string;
  
  fields = {
    name: {
      label: 'Full Name',
      placeholder: 'Enter your full name',
      title: 'User full name'
    }
  };
  
  validationRules = {
    name: ['required', 'min:2', 'max:50']
  };
}

// Component
export class UserFormComponent {
  user = new User();
  
  onNameChanged(model: User) {
    console.log('Name is valid:', model.name);
    // Auto-save or other logic here
  }
}
```

```html
<!-- Template -->
<dd-input 
  [model]="user" 
  field="name"
  [enableCharacterCounter]="true"
  [maxLength]="50"
  (changed)="onNameChanged($event)">
</dd-input>
```

**2. Email Input with Prepend Icon**
```typescript
// Model with email validation
export class User extends BaseModel {
  email: string;
  
  fields = {
    email: {
      label: 'Email Address',
      placeholder: 'your.email@example.com'
    }
  };
  
  validationRules = {
    email: ['required', 'email']
  };
}
```

```html
<dd-input 
  [model]="user" 
  field="email"
  type="email"
  prepend="📧"
  [autoFocus]="true">
</dd-input>
```

**3. Price Input with Currency Formatting**
```typescript
export class Product extends BaseModel {
  price: number;
  
  fields = {
    price: {
      label: 'Price',
      placeholder: '0.00'
    }
  };
  
  validationRules = {
    price: ['required', 'number', 'min:0']
  };
}
```

```html
<dd-input 
  [model]="product" 
  field="price"
  type="number"
  prepend="$"
  append="USD"
  inputClass="form-control text-right">
</dd-input>
```

**4. Search Input with Word Limit**
```typescript
export class SearchQuery extends BaseModel {
  query: string;
  
  fields = {
    query: {
      label: 'Search Terms',
      placeholder: 'Enter search keywords...'
    }
  };
}
```

```html
<dd-input 
  [model]="searchQuery" 
  field="query"
  [enableWordCounter]="true"
  [maxWords]="10"
  wordCounterWarningMessage="Too many search terms may slow results">
</dd-input>
```

**5. Read-Only Display Mode**
```html
<!-- Same model, different presentation -->
<dd-input 
  [model]="user" 
  field="name"
  [isViewOnly]="!editMode"
  viewOnlyClass="bg-light border-0 font-weight-bold">
</dd-input>
```

#### Character and Word Counter Behavior

**Character Counter:**
- Updates in real-time as user types
- Shows format: "current/max characters"
- Changes color when approaching limit (last 10 characters)
- Emits `maxLengthReached` event when limit is reached
- Prevents further typing when limit exceeded

**Word Counter:**
- Counts words separated by spaces
- Handles multiple spaces correctly
- Shows format: "current/max words" 
- Uses pluralization: "1 word" vs "2 words"
- Shows warning message when specified

#### Accessibility Features

- **ARIA Labels**: Automatically set from field metadata
- **Error Announcements**: Screen readers announce validation errors
- **Focus Management**: Proper tab order and focus states
- **High Contrast**: Works with high contrast mode
- **Keyboard Navigation**: Full keyboard support

#### Common Error Solutions

**Problem**: "Cannot read property 'label' of undefined"
**Solution**: Ensure your model has fields defined:
```typescript
fields = {
  yourField: {
    label: 'Your Label'
  }
}
```

**Problem**: Validation not working
**Solution**: Ensure validationRules are defined in your model:
```typescript
validationRules = {
  yourField: ['required']
}
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

### 7. DdataSelectComponent - Multi-Mode Selection Component

**Selector:** `dd-select`  
**Purpose:** Comprehensive selection component supporting 4 different modes: simple dropdown, single selection, multiple selection, and autocomplete search

#### Why Use dd-select Instead of HTML Select?

**HTML Select Limitations:**
```html
<!-- Basic HTML select is very limited -->
<select [(ngModel)]="user.countryId">
  <option value="">Choose country...</option>
  <option *ngFor="let country of countries" [value]="country.id">
    {{ country.name }}
  </option>
</select>

<!-- Problems with HTML select: -->
<!-- ❌ No search/filter capabilities -->
<!-- ❌ No multiple selection support -->
<!-- ❌ No custom item rendering -->
<!-- ❌ No validation integration -->
<!-- ❌ No complex object binding -->
<!-- ❌ Limited styling options -->
<!-- ❌ No dialog integration for complex selections -->
```

**dd-select Advantages:**
```html
<!-- One component, multiple powerful modes -->
<dd-select 
  mode="simple"           <!-- or "single", "multiple", "autocomplete" -->
  [model]="user" 
  field="countryId"
  [items]="countries"
  text="name"
  valueField="id">
</dd-select>

<!-- Benefits: -->
<!-- ✓ 4 different selection modes -->
<!-- ✓ Search and filter built-in -->
<!-- ✓ Multiple selection with chips -->
<!-- ✓ Complex object handling -->
<!-- ✓ Validation integration -->
<!-- ✓ Custom dialog support -->
<!-- ✓ Consistent styling -->
<!-- ✓ Accessibility support -->
```

#### Selection Modes Explained

**1. Simple Mode (`mode="simple"`)** - Standard HTML select dropdown
**2. Single Mode (`mode="single"`)** - Single selection with search and custom rendering  
**3. Multiple Mode (`mode="multiple"`)** - Multiple selection with chips display
**4. Autocomplete Mode (`mode="autocomplete"`)** - Search-as-you-type with suggestions

#### Complete Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `model` | `BaseModelInterface & FieldsInterface` | **Required** | Model containing the field |
| `field` | `string` | `'id'` | Field name in model to bind selected value(s) |
| `items` | `Array<unknown>` | `[]` | Array of selectable items |
| `mode` | `SelectType` | `'simple'` | Selection mode: 'simple', 'single', 'multiple', 'autocomplete' |
| `text` | `string` | `'name'` | Property name to display as item text |
| `valueField` | `string` | `'id'` | Property name to use as item value |
| `disabled` | `boolean` | `false` | Disables the entire component |
| `addEmptyOption` | `boolean` | `true` | Adds "Choose..." empty option in simple mode |
| `unselectedText` | `string` | `'Válassz'` | Placeholder text when nothing selected |
| `showIcon` | `boolean` | `false` | Shows icons next to items (if items have icon property) |
| `dialogSettings` | `DialogContentWithOptionsInterface` | `undefined` | Configuration for dialog-based selection |

#### Advanced Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `disabledAppearance` | `boolean` | `false` | Shows disabled styling without actually disabling |
| `disableShowSelectedItems` | `boolean` | `false` | Hides selected items display in multiple mode |
| `selectedElementsBlockClass` | `string` | `'col-12 d-flex flex-wrap px-0'` | CSS for selected items container |
| `selectedElementsBlockExtraClass` | `string` | `'col-md-9 d-flex flex-wrap'` | Additional CSS for selected items |

#### Deprecated Properties (Use `mode` instead)

| Property | Replacement | Note |
|----------|-------------|------|
| `fakeSingleSelect` | `mode="single"` | Will be removed in future versions |
| `multipleSelect` | `mode="multiple"` | Will be removed in future versions |

#### Output Events

| Event | Type | Payload | When Emitted |
|-------|------|---------|--------------|
| `selected` | `EventEmitter<unknown>` | Selected item or item ID | When user selects an item |
| `selectModel` | `EventEmitter<unknown>` | Updated model | When selection changes the model |

#### Selection Mode Examples

### **Mode 1: Simple Select (Standard Dropdown)**

**When to use:** Basic selection from a small list (< 20 items), like country, status, category

```typescript
// Model setup
export class User extends BaseModel {
  countryId: number;
  
  fields = {
    countryId: {
      label: 'Country',
      placeholder: 'Select your country'
    }
  };
}

// Component setup
export class UserFormComponent {
  user = new User();
  countries = [
    { id: 1, name: 'Hungary', code: 'HU' },
    { id: 2, name: 'Germany', code: 'DE' },
    { id: 3, name: 'France', code: 'FR' }
  ];
  
  onCountrySelected(countryId: number) {
    console.log('Selected country ID:', countryId);
    // Auto-load states/provinces for selected country
    this.loadStatesForCountry(countryId);
  }
}
```

```html
<dd-select 
  mode="simple"
  [model]="user" 
  field="countryId"
  [items]="countries"
  text="name"
  valueField="id"
  unselectedText="Choose your country..."
  (selected)="onCountrySelected($event)">
</dd-select>
```

### **Mode 2: Single Select (Enhanced Selection)**

**When to use:** Single selection with search capabilities, custom item display, or large lists

```typescript
export class Project extends BaseModel {
  managerId: number;
  manager: User;
  
  fields = {
    managerId: {
      label: 'Project Manager',
      placeholder: 'Search and select manager...'
    }
  };
}

export class ProjectFormComponent {
  project = new Project();
  allManagers: User[] = []; // Large list of users
  
  onManagerSelected(manager: User) {
    this.project.managerId = manager.id;
    this.project.manager = manager;
    console.log('Selected manager:', manager.name);
  }
}
```

```html
<dd-select 
  mode="single"
  [model]="project" 
  field="managerId"
  [items]="allManagers"
  text="name"              <!-- Show user name -->
  valueField="id"          <!-- Store user ID -->
  unselectedText="Search managers..."
  (selected)="onManagerSelected($event)">
</dd-select>

<!-- Enhanced display shows: -->
<!-- John Smith (john@company.com) -->
<!-- Search filters as you type -->
```

### **Mode 3: Multiple Select (Multi-Selection)**

**When to use:** Selecting multiple items, like skills, tags, categories, team members

```typescript
export class JobPosting extends BaseModel {
  skillIds: number[] = [];
  skills: Skill[] = [];
  
  fields = {
    skillIds: {
      label: 'Required Skills',
      placeholder: 'No skills selected'
    }
  };
}

export class JobFormComponent {
  job = new JobPosting();
  availableSkills: Skill[] = [
    { id: 1, name: 'TypeScript', category: 'Programming' },
    { id: 2, name: 'Angular', category: 'Framework' },
    { id: 3, name: 'Node.js', category: 'Backend' }
  ];
  
  onSkillsChanged(selectedSkills: Skill[]) {
    this.job.skillIds = selectedSkills.map(s => s.id);
    this.job.skills = selectedSkills;
    console.log('Selected skills:', selectedSkills.map(s => s.name));
  }
}
```

```html
<dd-select 
  mode="multiple"
  [model]="job" 
  field="skillIds"
  [items]="availableSkills"
  text="name"
  valueField="id"
  unselectedText="Select required skills..."
  (selectModel)="onSkillsChanged($event)">
</dd-select>

<!-- Displays selected items as chips: -->
<!-- [TypeScript ×] [Angular ×] [Node.js ×] -->
<!-- Click × to remove, click dropdown to add more -->
```

### **Mode 4: Autocomplete (Search-as-you-type)**

**When to use:** Large datasets, API-driven search, dynamic filtering

```typescript
export class Address extends BaseModel {
  cityId: number;
  city: City;
  
  fields = {
    cityId: {
      label: 'City',
      placeholder: 'Start typing city name...'
    }
  };
}

export class AddressFormComponent {
  address = new Address();
  cities: City[] = [];
  
  // Load cities based on search term
  searchCities(searchTerm: string) {
    if (searchTerm.length >= 2) {
      this.cityService.search(searchTerm).subscribe(results => {
        this.cities = results;
      });
    }
  }
  
  onCitySelected(city: City) {
    this.address.cityId = city.id;
    this.address.city = city;
    // Auto-load postal codes for selected city
    this.loadPostalCodes(city.id);
  }
}
```

```html
<dd-select 
  mode="autocomplete"
  [model]="address" 
  field="cityId"
  [items]="cities"
  text="name"
  valueField="id"
  unselectedText="Type to search cities..."
  (selected)="onCitySelected($event)"
  (search)="searchCities($event)">
</dd-select>

<!-- Behavior: -->
<!-- User types "New" → Shows "New York", "New Delhi", etc. -->
<!-- Real-time filtering as user types -->
<!-- Minimum 2 characters before search -->
```

### **Advanced: Dialog-Based Multiple Selection**

**When to use:** Complex selection scenarios, need for create/edit capabilities, large datasets with filtering

```typescript
export class Team extends BaseModel {
  memberIds: number[] = [];
  members: User[] = [];
}

export class TeamFormComponent {
  team = new Team();
  allUsers: User[] = [];
  
  // Dialog configuration for advanced selection
  dialogSettings: DialogContentWithOptionsInterface = {
    // Component for creating new users
    createEditComponent: UserCreateEditComponent,
    createEditOptions: {
      isModal: true,
      title: 'Add New Team Member'
    },
    
    // Component for listing/selecting users
    listComponent: UserListComponent,
    listOptions: {
      isModal: true,
      multipleSelectEnabled: true,
      isSelectionList: true,
      models: this.allUsers,
      selectedElements: this.team.members,
      loadData: false,
      // Additional filtering options
      filter: { isActive: true, department: 'Engineering' }
    }
  };
  
  onTeamMembersChanged(selectedMembers: User[]) {
    this.team.memberIds = selectedMembers.map(m => m.id);
    this.team.members = selectedMembers;
  }
}
```

```html
<dd-select 
  mode="multiple"
  [model]="team" 
  field="memberIds"
  [items]="allUsers"
  [dialogSettings]="dialogSettings"
  text="name"
  valueField="id"
  unselectedText="Select team members...">
</dd-select>

<!-- Clicking opens dialog with: -->
<!-- - Searchable user list -->
<!-- - Multiple selection checkboxes -->
<!-- - "Create New User" button -->
<!-- - Filter options (department, role, etc.) -->
<!-- - Pagination for large lists -->
```

### **Real-World Scenario Examples**

**1. E-commerce Product Categories**
```typescript
// Hierarchical category selection
export class Product extends BaseModel {
  categoryId: number;
  subcategoryIds: number[] = [];
}
```

```html
<!-- Primary category (single) -->
<dd-select 
  mode="simple"
  [model]="product" 
  field="categoryId"
  [items]="mainCategories"
  text="name"
  (selected)="loadSubcategories($event)">
</dd-select>

<!-- Subcategories (multiple) -->
<dd-select 
  mode="multiple"
  [model]="product" 
  field="subcategoryIds"
  [items]="subcategories"
  text="name">
</dd-select>
```

**2. Event Planning with Complex Dependencies**
```typescript
export class Event extends BaseModel {
  venueId: number;
  catererId: number;
  speakerIds: number[] = [];
}
```

```html
<!-- Venue selection affects catering options -->
<dd-select 
  mode="single"
  [model]="event" 
  field="venueId"
  [items]="venues"
  text="name"
  (selected)="loadVenueCaterers($event)">
</dd-select>

<!-- Caterers filtered by venue capabilities -->
<dd-select 
  mode="simple"
  [model]="event" 
  field="catererId"
  [items]="availableCaterers"
  text="companyName">
</dd-select>

<!-- Speakers with dialog for detailed selection -->
<dd-select 
  mode="multiple"
  [model]="event" 
  field="speakerIds"
  [items]="speakers"
  [dialogSettings]="speakerDialogSettings"
  text="fullName">
</dd-select>
```

**3. HR Employee Assignment**
```typescript
export class Project extends BaseModel {
  leaderId: number;
  teamMemberIds: number[] = [];
  skillRequirements: number[] = [];
}
```

```html
<!-- Project leader (must be senior level) -->
<dd-select 
  mode="autocomplete"
  [model]="project" 
  field="leaderId"
  [items]="seniorEmployees"
  text="fullName"
  unselectedText="Search project leaders...">
</dd-select>

<!-- Team members (exclude selected leader) -->
<dd-select 
  mode="multiple"
  [model]="project" 
  field="teamMemberIds"
  [items]="availableEmployees"
  [dialogSettings]="teamSelectionDialog"
  text="fullName">
</dd-select>

<!-- Required skills for filtering candidates -->
<dd-select 
  mode="multiple"
  [model]="project" 
  field="skillRequirements"
  [items]="allSkills"
  text="name"
  (selectModel)="filterEmployeesBySkills($event)">
</dd-select>
```

#### Component Behavior Details

**Simple Mode Behavior:**
- Renders as standard HTML `<select>` element
- Automatically adds empty option if `addEmptyOption` is true
- Single selection only
- No search capabilities
- Best performance for small lists

**Single Mode Behavior:**
- Custom dropdown with search input
- Filters items as user types
- Single selection with enhanced UI
- Can display complex item templates
- Supports keyboard navigation

**Multiple Mode Behavior:**
- Shows selected items as removable chips
- Dropdown allows adding more selections
- Can limit maximum selections
- Supports dialog-based selection for complex scenarios
- Integrates with create/edit components

**Autocomplete Mode Behavior:**
- Search input with dropdown suggestions
- Debounced search (reduces API calls)
- Minimum character threshold before search
- Highlights matching text in results
- Supports remote data loading

#### Integration with ddata-core

**Automatic Validation:**
```typescript
export class User extends BaseModel {
  countryId: number;
  
  validationRules = {
    countryId: ['required']  // Select validates as required
  };
}

// Validation error automatically shown if no selection made
```

**Field Metadata Integration:**
```typescript
fields = {
  countryId: {
    label: 'Country',           // Used as select label
    placeholder: 'Choose...',   // Used as unselected text
    title: 'User Country'       // Used as title attribute
  }
}
```

#### Common Integration Patterns

**1. Dependent Dropdowns:**
```typescript
onCountrySelected(countryId: number) {
  // Clear dependent fields
  this.user.stateId = null;
  this.user.cityId = null;
  
  // Load new options
  this.loadStatesForCountry(countryId);
}

onStateSelected(stateId: number) {
  this.user.cityId = null;
  this.loadCitiesForState(stateId);
}
```

**2. Dynamic Item Loading:**
```typescript
searchProducts(term: string) {
  if (term.length >= 2) {
    this.productService.search(term).subscribe(products => {
      this.products = products;
    });
  }
}
```

**3. Complex Object Binding:**
```typescript
onManagerSelected(manager: User) {
  // Store both ID and full object
  this.project.managerId = manager.id;
  this.project.manager = manager;
  
  // Update related fields
  this.project.departmentId = manager.departmentId;
}
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

### InputHelperService - Field Validation and Metadata Extraction

**Purpose:** Provides utility methods for extracting field metadata from models and performing validation

#### Why InputHelperService Matters

Without InputHelperService, every component would need to manually extract field information:

**Without InputHelperService:**
```typescript
// Manual field extraction in every component
getFieldLabel(): string {
  if (this.model && this.model.fields && this.model.fields[this.field]) {
    return this.model.fields[this.field].label || this.field;
  }
  return this.field || '';
}

getFieldPlaceholder(): string {
  if (this.model && this.model.fields && this.model.fields[this.field]) {
    return this.model.fields[this.field].placeholder || '';
  }
  return '';
}

// Repeat for every field property...
```

**With InputHelperService:**
```typescript
// Centralized, safe field extraction
this.label = this.helperService.getLabel(this.model, this.field);
this.placeholder = this.helperService.getPlaceholder(this.model, this.field);
```

#### Complete Method Reference

| Method | Parameters | Returns | Purpose | Safe Fallback |
|--------|------------|---------|---------|---------------|
| `validateField(model, field)` | `model: BaseModel`, `field: string` | `boolean` | Validates field against model rules | `false` if validation fails |
| `getTitle(model, field)` | `model: BaseModel`, `field: string` | `string` | Gets field title for tooltips | Field name if not defined |
| `getLabel(model, field)` | `model: BaseModel`, `field: string` | `string` | Gets field label for display | Formatted field name |
| `getPlaceholder(model, field)` | `model: BaseModel`, `field: string` | `string` | Gets field placeholder text | Empty string |
| `getPrepend(model, field)` | `model: BaseModel`, `field: string` | `string` | Gets text to show before input | Empty string |
| `getAppend(model, field)` | `model: BaseModel`, `field: string` | `string` | Gets text to show after input | Empty string |
| `isRequired(model, field)` | `model: BaseModel`, `field: string` | `boolean` | Checks if field is required | `false` if not required |
| `randChars()` | none | `string` | Generates unique 50-char string | Always returns valid string |

### DescriptionPipe - Smart Text Formatting

**Purpose:** Transforms description strings with special formatting for tel, email, url, and description patterns

#### Pattern Recognition and Transformation

The DescriptionPipe automatically recognizes patterns and converts them to clickable links:

| Pattern | Input | Output |
|---------|-------|--------|
| Phone | `tel:+36301234567` | `<a href="tel:+36301234567" class="mr-3">+36301234567</a>` |
| Email | `email:contact@example.com` | `<a href="mailto:contact@example.com" class="mr-3">contact@example.com</a>` |
| URL | `url:https://example.com` | `<a href="https://example.com" class="mr-3" target="_blank">https://example.com</a>` |
| Description | `description:Some text` | `<span class="description">Some text</span>` |

#### Real-World Usage Examples

**1. Contact Information Display**
```typescript
export class ContactComponent {
  contact = {
    info: "tel:+36301234567|email:john@company.com|url:https://company.com|description:Senior Developer"
  };
}
```

```html
<div [innerHTML]="contact.info | description"></div>
<!-- Renders as: -->
<!-- [📞 +36301234567] [✉ john@company.com] [🌐 company.com] Senior Developer -->
```

**2. Business Listing**
```typescript
export class Business extends BaseModel {
  contactDetails: string;
  
  fields = {
    contactDetails: {
      label: 'Contact Information'
    }
  };
}
```

```html
<dd-input 
  [model]="business" 
  field="contactDetails"
  placeholder="tel:phone|email:email|url:website">
</dd-input>

<div class="contact-display" [innerHTML]="business.contactDetails | description"></div>
```

## Real-World Complete Examples

### Example 1: E-commerce Product Management

**Complete product management form with all component types:**

```typescript
export class Product extends BaseModel {
  readonly api_endpoint = '/api/products';
  readonly model_name = 'Product';
  readonly use_localstorage = true;

  // Basic product info
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice: number;
  
  // Product attributes
  categoryId: number;
  category: Category;
  tagIds: number[] = [];
  tags: Tag[] = [];
  brandId: number;
  
  // Physical attributes
  weight: number;
  dimensions: string;
  color: string;
  
  // Availability
  inStock: boolean;
  stockCount: number;
  availableFrom: ISODate;
  saleEndTime: string;
  
  // SEO and marketing
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  
  fields: FieldContainerInterface<ProductUIFieldsInterface> = {
    name: {
      label: 'Product Name',
      placeholder: 'Enter product name',
      title: 'The main product name displayed to customers'
    },
    description: {
      label: 'Full Description',
      placeholder: 'Detailed product description...',
      title: 'Complete product description with features and benefits'
    },
    shortDescription: {
      label: 'Short Description',
      placeholder: 'Brief product summary...',
      title: 'Brief description for product listings'
    },
    price: {
      label: 'Regular Price',
      placeholder: '0.00',
      title: 'Product price in USD',
      prepend: '$',
      append: 'USD'
    },
    salePrice: {
      label: 'Sale Price',
      placeholder: '0.00',
      title: 'Discounted price (optional)',
      prepend: '$',
      append: 'USD'
    },
    categoryId: {
      label: 'Category',
      placeholder: 'Select product category',
      title: 'Primary product category'
    },
    tagIds: {
      label: 'Tags',
      placeholder: 'Select product tags',
      title: 'Product tags for filtering and search'
    },
    brandId: {
      label: 'Brand',
      placeholder: 'Select brand',
      title: 'Product brand or manufacturer'
    },
    color: {
      label: 'Primary Color',
      placeholder: '#FF0000',
      title: 'Main product color'
    },
    inStock: {
      label: 'In Stock',
      title: 'Whether product is currently available'
    },
    availableFrom: {
      label: 'Available From',
      placeholder: 'Select availability date',
      title: 'Date when product becomes available'
    },
    saleEndTime: {
      label: 'Sale End Time',
      placeholder: 'Select time',
      title: 'Time when sale pricing ends'
    }
  };

  validationRules: ValidationRuleInterface = {
    name: ['required', 'string', 'min:3', 'max:100'],
    description: ['required', 'string', 'min:10'],
    shortDescription: ['required', 'string', 'max:200'],
    price: ['required', 'number', 'min:0'],
    salePrice: ['nullable', 'number', 'min:0'],
    categoryId: ['required', 'integer'],
    brandId: ['required', 'integer'],
    color: ['required', 'color_code'],
    stockCount: ['required', 'integer', 'min:0'],
    availableFrom: ['required', 'iso_date'],
    metaTitle: ['nullable', 'string', 'max:60'],
    metaDescription: ['nullable', 'string', 'max:160']
  };

  init(data: any = null): Product {
    data = !!data ? data : {};
    
    this.name = !!data.name ? String(data.name) : '';
    this.description = !!data.description ? String(data.description) : '';
    this.shortDescription = !!data.shortDescription ? String(data.shortDescription) : '';
    this.price = !!data.price ? Number(data.price) : 0;
    this.salePrice = !!data.salePrice ? Number(data.salePrice) : 0;
    this.categoryId = !!data.categoryId ? Number(data.categoryId) : 0;
    this.tagIds = !!data.tagIds ? data.tagIds : [];
    this.brandId = !!data.brandId ? Number(data.brandId) : 0;
    this.color = !!data.color ? String(data.color) : '#000000';
    this.inStock = !!data.inStock ? Boolean(data.inStock) : true;
    this.stockCount = !!data.stockCount ? Number(data.stockCount) : 0;
    this.availableFrom = !!data.availableFrom ? data.availableFrom : this.getCurrentISODate();
    this.saleEndTime = !!data.saleEndTime ? data.saleEndTime : '';
    
    return this;
  }
}

@Component({
  selector: 'app-product-form',
  template: `
    <form class="product-form">
      <div class="row">
        <!-- Basic Information -->
        <div class="col-12">
          <h3>Basic Information</h3>
        </div>
        
        <div class="col-12">
          <dd-input 
            [model]="product" 
            field="name"
            [enableCharacterCounter]="true"
            [maxLength]="100"
            [autoFocus]="true"
            (changed)="onProductChanged($event)">
          </dd-input>
        </div>
        
        <div class="col-12">
          <dd-textarea 
            [model]="product" 
            field="description"
            [rows]="6"
            [enableWordCounter]="true"
            [maxWords]="500"
            (changed)="onProductChanged($event)">
          </dd-textarea>
        </div>
        
        <div class="col-12">
          <dd-textarea 
            [model]="product" 
            field="shortDescription"
            [rows]="3"
            [enableCharacterCounter]="true"
            [maxLength]="200"
            (changed)="onProductChanged($event)">
          </dd-textarea>
        </div>
        
        <!-- Pricing -->
        <div class="col-12">
          <h3>Pricing</h3>
        </div>
        
        <div class="col-md-6">
          <dd-input 
            [model]="product" 
            field="price"
            type="number"
            inputClass="form-control text-right"
            (changed)="onPriceChanged($event)">
          </dd-input>
        </div>
        
        <div class="col-md-6">
          <dd-input 
            [model]="product" 
            field="salePrice"
            type="number"
            inputClass="form-control text-right"
            (changed)="onPriceChanged($event)">
          </dd-input>
        </div>
        
        <!-- Categorization -->
        <div class="col-12">
          <h3>Categorization</h3>
        </div>
        
        <div class="col-md-6">
          <dd-select 
            mode="simple"
            [model]="product" 
            field="categoryId"
            [items]="categories"
            text="name"
            valueField="id"
            (selected)="onCategoryChanged($event)">
          </dd-select>
        </div>
        
        <div class="col-md-6">
          <dd-select 
            mode="simple"
            [model]="product" 
            field="brandId"
            [items]="brands"
            text="name"
            valueField="id">
          </dd-select>
        </div>
        
        <div class="col-12">
          <dd-select 
            mode="multiple"
            [model]="product" 
            field="tagIds"
            [items]="tags"
            text="name"
            valueField="id"
            unselectedText="Select product tags...">
          </dd-select>
        </div>
        
        <!-- Physical Attributes -->
        <div class="col-12">
          <h3>Physical Attributes</h3>
        </div>
        
        <div class="col-md-6">
          <dd-input-color 
            [model]="product" 
            field="color">
          </dd-input-color>
        </div>
        
        <div class="col-md-6">
          <dd-input 
            [model]="product" 
            field="weight"
            type="number"
            append="kg">
          </dd-input>
        </div>
        
        <!-- Availability -->
        <div class="col-12">
          <h3>Availability</h3>
        </div>
        
        <div class="col-md-4">
          <dd-input-checkbox 
            [model]="product" 
            field="inStock">
          </dd-input-checkbox>
        </div>
        
        <div class="col-md-4">
          <dd-input-date 
            [model]="product" 
            field="availableFrom"
            format="DD/MM/YYYY">
          </dd-input-date>
        </div>
        
        <div class="col-md-4">
          <dd-input-time 
            [model]="product" 
            field="saleEndTime"
            [format]="24">
          </dd-input-time>
        </div>
        
        <!-- Actions -->
        <div class="col-12 mt-4">
          <button type="button" 
                  class="btn btn-primary me-2"
                  [disabled]="!isFormValid"
                  (click)="saveProduct()">
            Save Product
          </button>
          <button type="button" 
                  class="btn btn-secondary"
                  (click)="previewProduct()">
            Preview
          </button>
        </div>
      </div>
    </form>
  `
})
export class ProductFormComponent {
  product = new Product();
  
  // Data for selects
  categories: Category[] = [];
  brands: Brand[] = [];
  tags: Tag[] = [];
  
  // Service integration
  productService = new ProxyService<Product>(new Product());
  
  get isFormValid(): boolean {
    return this.product.validationErrors.length === 0;
  }
  
  ngOnInit() {
    this.loadFormData();
  }
  
  async loadFormData() {
    // Load all required data for form
    this.categories = await this.categoryService.getAll().toPromise();
    this.brands = await this.brandService.getAll().toPromise();
    this.tags = await this.tagService.getAll().toPromise();
  }
  
  onProductChanged(model: Product) {
    console.log('Product updated:', model);
    // Auto-save draft every few seconds
    this.autoSaveDraft();
  }
  
  onCategoryChanged(categoryId: number) {
    // Update subcategory options based on selected category
    this.loadSubcategoriesFor(categoryId);
  }
  
  onPriceChanged(model: Product) {
    // Validate sale price is less than regular price
    if (model.salePrice > model.price) {
      // Add custom validation error
      this.product.validationErrors.push({
        field: 'salePrice',
        message: 'Sale price cannot be higher than regular price'
      });
    }
  }
  
  saveProduct() {
    if (this.isFormValid) {
      this.productService.save(this.product).subscribe({
        next: (result) => {
          console.log('Product saved successfully');
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Failed to save product:', error);
        }
      });
    }
  }
}
```

### Example 2: Advanced User Registration Form

**Multi-step registration with complex validation and dependent fields:**

```typescript
export class UserRegistration extends BaseModel {
  // Personal information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: ISODate;
  
  // Address information
  countryId: number;
  stateId: number;
  cityId: number;
  address: string;
  postalCode: string;
  
  // Account preferences
  preferredLanguage: string;
  timezone: string;
  notifications: boolean;
  marketingEmails: boolean;
  
  // Professional information
  jobTitle: string;
  company: string;
  industry: string;
  skillIds: number[] = [];
  
  fields = {
    firstName: {
      label: 'First Name',
      placeholder: 'Enter your first name'
    },
    email: {
      label: 'Email Address',
      placeholder: 'your.email@example.com'
    },
    countryId: {
      label: 'Country',
      placeholder: 'Select your country'
    },
    skillIds: {
      label: 'Skills',
      placeholder: 'Select your skills'
    }
    // ... other field definitions
  };

  validationRules = {
    firstName: ['required', 'string', 'min:2', 'max:50'],
    lastName: ['required', 'string', 'min:2', 'max:50'],
    email: ['required', 'email', 'unique:users,email'],
    phone: ['required', 'phonenumber'],
    birthDate: ['required', 'iso_date', 'before:18_years_ago'],
    countryId: ['required', 'integer'],
    address: ['required', 'string', 'min:10'],
    postalCode: ['required', 'string'],
    preferredLanguage: ['required', 'string'],
    jobTitle: ['nullable', 'string', 'max:100'],
    company: ['nullable', 'string', 'max:100']
  };
}

@Component({
  template: `
    <div class="registration-wizard">
      <!-- Step indicators -->
      <div class="steps-indicator mb-4">
        <div class="step" [class.active]="currentStep === 1" [class.completed]="currentStep > 1">
          1. Personal Info
        </div>
        <div class="step" [class.active]="currentStep === 2" [class.completed]="currentStep > 2">
          2. Address
        </div>
        <div class="step" [class.active]="currentStep === 3" [class.completed]="currentStep > 3">
          3. Professional
        </div>
        <div class="step" [class.active]="currentStep === 4">
          4. Preferences
        </div>
      </div>
      
      <!-- Step 1: Personal Information -->
      <div *ngIf="currentStep === 1" class="step-content">
        <h3>Personal Information</h3>
        
        <div class="row">
          <div class="col-md-6">
            <dd-input [model]="registration" field="firstName" [autoFocus]="true"></dd-input>
          </div>
          <div class="col-md-6">
            <dd-input [model]="registration" field="lastName"></dd-input>
          </div>
          <div class="col-12">
            <dd-input [model]="registration" field="email" type="email"></dd-input>
          </div>
          <div class="col-12">
            <dd-input [model]="registration" field="phone"></dd-input>
          </div>
          <div class="col-12">
            <dd-input-date [model]="registration" field="birthDate"></dd-input-date>
          </div>
        </div>
      </div>
      
      <!-- Step 2: Address Information -->
      <div *ngIf="currentStep === 2" class="step-content">
        <h3>Address Information</h3>
        
        <div class="row">
          <div class="col-12">
            <dd-select 
              mode="simple"
              [model]="registration" 
              field="countryId"
              [items]="countries"
              text="name"
              (selected)="onCountryChanged($event)">
            </dd-select>
          </div>
          <div class="col-md-6">
            <dd-select 
              mode="simple"
              [model]="registration" 
              field="stateId"
              [items]="states"
              text="name"
              [disabled]="!registration.countryId"
              (selected)="onStateChanged($event)">
            </dd-select>
          </div>
          <div class="col-md-6">
            <dd-select 
              mode="autocomplete"
              [model]="registration" 
              field="cityId"
              [items]="cities"
              text="name"
              [disabled]="!registration.stateId">
            </dd-select>
          </div>
          <div class="col-12">
            <dd-textarea [model]="registration" field="address" [rows]="3"></dd-textarea>
          </div>
          <div class="col-md-6">
            <dd-input [model]="registration" field="postalCode"></dd-input>
          </div>
        </div>
      </div>
      
      <!-- Step 3: Professional Information -->
      <div *ngIf="currentStep === 3" class="step-content">
        <h3>Professional Information</h3>
        
        <div class="row">
          <div class="col-md-6">
            <dd-input [model]="registration" field="jobTitle"></dd-input>
          </div>
          <div class="col-md-6">
            <dd-input [model]="registration" field="company"></dd-input>
          </div>
          <div class="col-12">
            <dd-select 
              mode="simple"
              [model]="registration" 
              field="industry"
              [items]="industries"
              text="name">
            </dd-select>
          </div>
          <div class="col-12">
            <dd-select 
              mode="multiple"
              [model]="registration" 
              field="skillIds"
              [items]="skills"
              text="name"
              valueField="id"
              [dialogSettings]="skillsDialogSettings">
            </dd-select>
          </div>
        </div>
      </div>
      
      <!-- Step 4: Preferences -->
      <div *ngIf="currentStep === 4" class="step-content">
        <h3>Account Preferences</h3>
        
        <div class="row">
          <div class="col-md-6">
            <dd-select 
              mode="simple"
              [model]="registration" 
              field="preferredLanguage"
              [items]="languages"
              text="name">
            </dd-select>
          </div>
          <div class="col-md-6">
            <dd-select 
              mode="simple"
              [model]="registration" 
              field="timezone"
              [items]="timezones"
              text="displayName">
            </dd-select>
          </div>
          <div class="col-12">
            <dd-input-checkbox [model]="registration" field="notifications"></dd-input-checkbox>
          </div>
          <div class="col-12">
            <dd-input-checkbox [model]="registration" field="marketingEmails"></dd-input-checkbox>
          </div>
        </div>
      </div>
      
      <!-- Navigation buttons -->
      <div class="step-navigation mt-4">
        <button type="button" 
                class="btn btn-secondary me-2"
                [disabled]="currentStep === 1"
                (click)="previousStep()">
          Previous
        </button>
        <button type="button" 
                class="btn btn-primary"
                [disabled]="!canProceed()"
                (click)="nextStep()"
                *ngIf="currentStep < 4">
          Next
        </button>
        <button type="button" 
                class="btn btn-success"
                [disabled]="!canComplete()"
                (click)="completeRegistration()"
                *ngIf="currentStep === 4">
          Complete Registration
        </button>
      </div>
    </div>
  `
})
export class UserRegistrationComponent {
  registration = new UserRegistration();
  currentStep = 1;
  
  // Data for dependent dropdowns
  countries: Country[] = [];
  states: State[] = [];
  cities: City[] = [];
  
  // Professional data
  industries: Industry[] = [];
  skills: Skill[] = [];
  
  // System data
  languages: Language[] = [];
  timezones: Timezone[] = [];
  
  canProceed(): boolean {
    // Validate current step fields
    switch (this.currentStep) {
      case 1:
        return this.validateFields(['firstName', 'lastName', 'email', 'phone', 'birthDate']);
      case 2:
        return this.validateFields(['countryId', 'stateId', 'cityId', 'address', 'postalCode']);
      case 3:
        return true; // Professional info is optional
      case 4:
        return this.validateFields(['preferredLanguage', 'timezone']);
      default:
        return false;
    }
  }
  
  onCountryChanged(countryId: number) {
    this.registration.stateId = 0;
    this.registration.cityId = 0;
    this.states = [];
    this.cities = [];
    
    if (countryId) {
      this.locationService.getStatesForCountry(countryId).subscribe(states => {
        this.states = states;
      });
    }
  }
  
  onStateChanged(stateId: number) {
    this.registration.cityId = 0;
    this.cities = [];
    
    if (stateId) {
      this.locationService.getCitiesForState(stateId).subscribe(cities => {
        this.cities = cities;
      });
    }
  }
}
```

## Troubleshooting Guide

### Common Issues and Solutions

**1. "Cannot read property 'fields' of undefined"**
```typescript
// Problem: Model not initialized
<dd-input [model]="user" field="name"></dd-input>  // user is undefined

// Solution: Always initialize models
export class MyComponent {
  user = new User();  // ✓ Initialized
  // OR
  user: User;
  ngOnInit() {
    this.user = new User();
  }
}
```

**2. "Validation not working"**
```typescript
// Problem: Missing validation rules
export class User extends BaseModel {
  name: string;
  // Missing validationRules!
}

// Solution: Define validation rules
export class User extends BaseModel {
  name: string;
  
  validationRules = {
    name: ['required', 'min:2']  // ✓ Validation rules defined
  };
}
```

**3. "Select dropdown shows [object Object]"**
```typescript
// Problem: Wrong text property
<dd-select [items]="users" text="fullName"></dd-select>  // users don't have fullName

// Solution: Use correct property names
<dd-select [items]="users" text="name" valueField="id"></dd-select>
```

**4. "Character counter not showing"**
```typescript
// Problem: Counter not enabled
<dd-input [model]="user" field="name"></dd-input>

// Solution: Enable counter explicitly
<dd-input 
  [model]="user" 
  field="name"
  [enableCharacterCounter]="true"
  [maxLength]="50">
</dd-input>
```

**5. "FontAwesome icons not displaying"**
```typescript
// Problem: Icons not imported
// Solution: Import icons in app.module.ts
import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCheckSquare, faSquare);
  }
}
```

## Best Practices and Performance

### 1. **Model Initialization Patterns**

**✓ Good:**
```typescript
export class UserFormComponent {
  user = new User();  // Initialize immediately
  
  loadUser(id: number) {
    this.userService.getOne(id).subscribe(userData => {
      this.user = new User().init(userData);  // Re-initialize with data
    });
  }
}
```

**❌ Avoid:**
```typescript
export class UserFormComponent {
  user: User;  // Uninitialized - will cause errors
  
  ngOnInit() {
    // Components already trying to access user.fields before this runs
    this.user = new User();
  }
}
```

### 2. **Efficient Select Data Loading**

**✓ Good:**
```typescript
export class FormComponent {
  // Load static data once
  countries$ = this.countryService.getAll().pipe(shareReplay(1));
  
  // Load dependent data as needed
  states$ = this.form.get('countryId')?.valueChanges.pipe(
    distinctUntilChanged(),
    switchMap(countryId => this.stateService.getByCountry(countryId)),
    shareReplay(1)
  );
}
```

**❌ Avoid:**
```typescript
export class FormComponent {
  // Loading data on every change
  onCountryChanged(countryId: number) {
    this.stateService.getByCountry(countryId).subscribe(states => {
      this.states = states;  // No caching, multiple API calls
    });
  }
}
```

### 3. **Validation Performance**

**✓ Good:**
```typescript
export class User extends BaseModel {
  validationRules = {
    email: ['required', 'email'],  // Simple, fast rules
    name: ['required', 'min:2', 'max:50']
  };
  
  // Custom validation for complex scenarios
  customValidatePassword(): boolean {
    return this.password.length >= 8 && /[A-Z]/.test(this.password);
  }
}
```

**❌ Avoid:**
```typescript
export class User extends BaseModel {
  validationRules = {
    // Expensive regex on every keystroke
    email: ['required', 'regex:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/']
  };
}
```

This comprehensive documentation provides everything needed to understand, implement, and troubleshoot ddata-ui-input components effectively, with real-world examples demonstrating the significant benefits over custom implementations.